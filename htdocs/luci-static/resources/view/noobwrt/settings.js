'use strict';
'require view';
'require form';
'require uci';
'require rpc';

/*
 * When /etc/config/noobwrt does not exist the page would throw an RPC error.
 * Bootstrap creates the config on the router via uci/add + commit, then
 * does a real uci.load() so the form renders with proper section data.
 */

var callUciAdd = rpc.declare({
    object: 'uci',
    method: 'add',
    params: ['config', 'type', 'name', 'values'],
    reject: false
});

var callUciCommit = rpc.declare({
    object: 'uci',
    method: 'commit',
    params: ['config'],
    reject: false
});

var DEFAULT_TOOLBAR = [
    ['toolbar_home',     'Home',       '/cgi-bin/luci/admin/status/overview',              'home.png',     '1' ],
    ['toolbar_status',   'Status',     '/cgi-bin/luci/admin/modem/modemdata',               'signal.png',   '2' ],
    ['toolbar_modem',    'Modem',      '/cgi-bin/luci/admin/modem/qmodem',                  'cell.png',     '3' ],
    ['toolbar_sms',      'SMS',        '/cgi-bin/luci/admin/modem/luci-app-sms-tool-js',    'sms.png',      '4' ],
    ['toolbar_data',     'Data Usage', '/cgi-bin/luci/admin/tools/netstat',                 'network.png',  '5' ],
    ['toolbar_nas',      'NAS',        '/cgi-bin/luci/admin/services/samba4',               'nas.png',      '6' ],
    ['toolbar_wireless', 'Wireless',   '/cgi-bin/luci/admin/network/wireless',              'wifi.png',     '7' ],
    ['toolbar_firewall', 'Firewall',   '/cgi-bin/luci/admin/network/firewall',              'firewall.png', '8' ],
    ['toolbar_system',   'System',     '/cgi-bin/luci/admin/system/system',                 'settings.png', '9' ],
    ['toolbar_terminal', 'Terminal',   '/cgi-bin/luci/admin/services/ttyd',                 'terminal.png', '10'],
    ['toolbar_vpn',      'VPN',        '/cgi-bin/luci/admin/services/passwall',             'vpn.png',      '11'],
    ['toolbar_files',    'Files',      '/cgi-bin/luci/admin/nas/tinyfilemanager',           'files.png',    '12'],
    ['toolbar_log',      'System Log', '/cgi-bin/luci/admin/status/logs',                   'info.png',     '13']
];

function bootstrapConfig() {
    var tasks = [];

    tasks.push(callUciAdd('noobwrt', 'global', 'global', {
        mode:                'normal',
        primary:             '#5e72e4',
        dark_primary:        '#7c8ff5',
        blur:                '10',
        blur_dark:           '10',
        transparency:        '0.8',
        transparency_dark:   '0.8',
        online_wallpaper:    'bing',
        use_exact_resolution:'1'
    }));

    DEFAULT_TOOLBAR.forEach(function (t) {
        tasks.push(callUciAdd('noobwrt', 'toolbar_item', t[0], {
            title:   t[1],
            url:     t[2],
            icon:    t[3],
            enabled: '1',
            order:   t[4]
        }));
    });

    return Promise.all(tasks)
        .then(function () { return callUciCommit('noobwrt'); })
        .then(function () { return uci.load('noobwrt'); });
}

return view.extend({
    load: function () {
        return uci.load('noobwrt').catch(function () {
            /* Config not found — create defaults on the router then reload. */
            return bootstrapConfig();
        });
    },

    render: function () {
        var m, s, o;

        m = new form.Map('noobwrt', _('NoobWrt Theme Settings'),
            _('Customize the appearance, wallpaper, background effects, and toolbar panel of the NoobWrt LuCI theme.'));

        /* ============================================================
         * SECTION: Global – tabbed (Appearance / Wallpaper / Effects)
         * ============================================================ */
        s = m.section(form.NamedSection, 'global', 'global');
        s.addremove = false;
        s.anonymous = true;

        s.tab('appearance', _('Appearance'));
        s.tab('wallpaper',  _('Wallpaper'));
        s.tab('effects',    _('Background Effects'));

        /* ---- Appearance ---- */
        o = s.taboption('appearance', form.ListValue, 'mode',
            _('Default Theme Mode'),
            _('Theme applied on page load. Users can toggle it at any time using the toolbar sun/moon button.'));
        o.value('normal', _('Light'));
        o.value('dark',   _('Dark'));

        o = s.taboption('appearance', form.Value, 'primary',
            _('Accent Color — Light Mode'),
            _('Primary accent color used throughout the light theme. Hex format, e.g. #5e72e4'));
        o.placeholder = '#5e72e4';
        o.rmempty = false;

        o = s.taboption('appearance', form.Value, 'dark_primary',
            _('Accent Color — Dark Mode'),
            _('Primary accent color used throughout the dark theme. Hex format, e.g. #7c8ff5'));
        o.placeholder = '#7c8ff5';
        o.rmempty = false;

        /* ---- Wallpaper ---- */
        o = s.taboption('wallpaper', form.ListValue, 'online_wallpaper',
            _('Wallpaper Source'),
            _('Online source for the login page background image. Set to Disabled to use a local background file.'));
        o.value('',          _('Disabled'));
        o.value('bing',      _('Bing Daily Image'));
        o.value('unsplash',  _('Unsplash — Random Photo'));
        o.value('wallhaven', _('Wallhaven — Random Wallpaper'));

        o = s.taboption('wallpaper', form.Value, 'use_api_key',
            _('API Key'),
            _('Optional API key for Unsplash or Wallhaven. Grants access to more images and higher quality results.'));
        o.placeholder = _('Leave empty for anonymous access');
        o.password = true;
        o.optional = true;

        o = s.taboption('wallpaper', form.Flag, 'use_exact_resolution',
            _('Exact Resolution Filter (Wallhaven)'),
            _('Only return wallpapers with exactly 1920×1080 resolution. Disable to allow "at least" this resolution.'));
        o.default = '1';
        o.depends('online_wallpaper', 'wallhaven');

        /* ---- Background Effects ---- */
        o = s.taboption('effects', form.Value, 'blur',
            _('Blur Radius — Light Mode'),
            _('Login page background blur radius in pixels for light mode. Default: 10'));
        o.placeholder = '10';
        o.datatype = 'uinteger';

        o = s.taboption('effects', form.Value, 'blur_dark',
            _('Blur Radius — Dark Mode'),
            _('Login page background blur radius in pixels for dark mode. Default: 10'));
        o.placeholder = '10';
        o.datatype = 'uinteger';

        o = s.taboption('effects', form.Value, 'transparency',
            _('Background Opacity — Light Mode'),
            _('Overlay opacity on the login page background for light mode. Range: 0.0 (transparent) to 1.0 (opaque). Default: 0.8'));
        o.placeholder = '0.8';

        o = s.taboption('effects', form.Value, 'transparency_dark',
            _('Background Opacity — Dark Mode'),
            _('Overlay opacity on the login page background for dark mode. Default: 0.8'));
        o.placeholder = '0.8';

        /* ============================================================
         * SECTION: Toolbar Panel Items (TableSection)
         * ============================================================ */
        s = m.section(form.TableSection, 'toolbar_item',
            _('Toolbar Panel Items'),
            _('Quick-access links displayed in the right-side toolbar panel on every page. ' +
              'Items are rendered in ascending Order number. ' +
              'Use the Add button below to create new entries.'));
        s.addremove = true;
        s.anonymous = true;
        s.sortable  = false;
        s.nodescriptions = true;

        o = s.option(form.Flag, 'enabled', _('Enable'));
        o.default = '1';
        o.editable = true;

        o = s.option(form.Value, 'title', _('Label'));
        o.placeholder = 'Home';
        o.rmempty = false;
        o.editable = true;

        o = s.option(form.Value, 'url', _('URL / Path'));
        o.placeholder = '/cgi-bin/luci/admin/status/overview';
        o.rmempty = false;
        o.editable = true;

        o = s.option(form.ListValue, 'icon', _('Icon'));
        [
            ['home.png',     _('Home')],
            ['signal.png',   _('Signal / Status')],
            ['cell.png',     _('Cell / Modem')],
            ['sms.png',      _('SMS')],
            ['network.png',  _('Network / Data Usage')],
            ['nas.png',      _('NAS / Storage')],
            ['wifi.png',     _('WiFi / Wireless')],
            ['firewall.png', _('Firewall')],
            ['settings.png', _('Settings / System')],
            ['terminal.png', _('Terminal')],
            ['vpn.png',      _('VPN')],
            ['files.png',    _('Files')],
            ['info.png',     _('Info / Log')]
        ].forEach(function (v) { o.value(v[0], v[1]); });
        o.editable = true;

        o = s.option(form.Value, 'order',
            _('Order'),
            _('Lower numbers appear first in the toolbar.'));
        o.datatype = 'uinteger';
        o.placeholder = '10';
        o.editable = true;

        return m.render();
    }
});
