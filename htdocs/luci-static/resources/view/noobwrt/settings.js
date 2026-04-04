'use strict';
'require view';
'require form';
'require uci';

return view.extend({
    load: function () {
        /* Silently ignore a missing /etc/config/noobwrt.
         * The form renders with placeholder defaults; the first Save will
         * create the config.  Attempting to bootstrap via uci/commit fails
         * with -32002 when no root password is set (unauthenticated session). */
        return uci.load('noobwrt').catch(function () {});
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
