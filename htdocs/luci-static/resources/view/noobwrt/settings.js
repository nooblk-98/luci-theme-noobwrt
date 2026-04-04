'use strict';
'require view';
'require form';
'require uci';
'require rpc';
'require request';

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
         * SECTION: Global – tabbed (Appearance / Wallpaper / Effects / Toolbar / About)
         * ============================================================ */
        s = m.section(form.NamedSection, 'global', 'global');
        s.addremove = false;
        s.anonymous = true;

        s.tab('appearance', _('Appearance'));
        s.tab('wallpaper',  _('Wallpaper'));
        s.tab('effects',    _('Background Effects'));
        s.tab('toolbar',    _('Toolbar Panel'));
        s.tab('about',      _('About'));

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
        o = s.taboption('wallpaper', form.DummyValue, '_wallpaper_ui', '');
        o.rawhtml = true;
        o.default = '\
<div style="max-width:520px">\
  <p style="margin:0 0 12px;color:#888;font-size:13px">Upload a custom image to use as the login page background. Supported formats: JPG, PNG, WebP (max 10 MB).</p>\
  <div id="noobwrt-wp-preview" style="margin-bottom:16px;border-radius:10px;overflow:hidden;background:#f0f0f0;height:160px;display:flex;align-items:center;justify-content:center">\
    <img id="noobwrt-wp-img" src="" style="width:100%;height:100%;object-fit:cover;display:none" />\
    <span id="noobwrt-wp-placeholder" style="color:#aaa;font-size:13px">No custom wallpaper \u2014 using default</span>\
  </div>\
  <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">\
    <label id="noobwrt-wp-label" style="display:inline-flex;align-items:center;gap:8px;cursor:pointer;background:#5e72e4;color:#fff;padding:8px 18px;border-radius:6px;font-size:13px;font-weight:500">\
      <input id="noobwrt-wp-file" type="file" accept="image/jpeg,image/png,image/webp" style="display:none" />\
      Upload Wallpaper\
    </label>\
    <button id="noobwrt-wp-revert" type="button" style="padding:8px 16px;border-radius:6px;font-size:13px;border:1px solid #ddd;background:#fff;cursor:pointer;color:#555">Revert to Default</button>\
  </div>\
  <p id="noobwrt-wp-status" style="margin-top:10px;font-size:12px;color:#888;min-height:18px"></p>\
</div>\
<script>\
(function(){\
  var BGPATH  = "/www/luci-static/noobwrt/background/custom.jpg";\
  var BGURL   = "/luci-static/noobwrt/background/custom.jpg";\
  var img     = document.getElementById("noobwrt-wp-img");\
  var ph      = document.getElementById("noobwrt-wp-placeholder");\
  var st      = document.getElementById("noobwrt-wp-status");\
  var fi      = document.getElementById("noobwrt-wp-file");\
  var label   = document.getElementById("noobwrt-wp-label");\
  var rv      = document.getElementById("noobwrt-wp-revert");\
  function setStatus(msg, ok) {\
    st.textContent = msg;\
    st.style.color = ok === true ? "#2dce89" : ok === false ? "#f5365c" : "#888";\
  }\
  function showPreview(url) { img.src = url; img.style.display = ""; ph.style.display = "none"; }\
  function hidePreview() { img.src = ""; img.style.display = "none"; ph.style.display = ""; }\
  /* Show preview if custom wallpaper already exists */\
  fetch(BGURL, { method: "HEAD" })\
    .then(function(r) { if (r.ok) showPreview(BGURL + "?_=" + Date.now()); })\
    .catch(function() {});\
  label.addEventListener("click", function() { fi.click(); });\
  fi.addEventListener("change", function() {\
    var file = fi.files[0];\
    if (!file) return;\
    if (file.size > 10 * 1024 * 1024) { setStatus("File too large (max 10 MB)", false); return; }\
    setStatus("Uploading...", null);\
    var sid = L.env.sessionid;\
    var fd = new FormData();\
    fd.append("sessionid", sid);\
    fd.append("filename", BGPATH);\
    fd.append("filedata", file);\
    fetch(L.env.cgi_base + "/cgi-upload", { method: "POST", body: fd })\
      .then(function(res) { return res.json(); })\
      .then(function(reply) {\
        if (reply && (reply.size > 0 || reply.size === 0 && !reply.failure)) {\
          setStatus("Wallpaper uploaded! Refresh the login page to see it.", true);\
          showPreview(BGURL + "?_=" + Date.now());\
        } else {\
          setStatus("Upload failed \u2014 " + (reply && reply.failure ? reply.failure : "check permissions"), false);\
        }\
      }).catch(function(e) { setStatus("Upload error: " + e.message, false); });\
  });\
  rv.addEventListener("click", function() {\
    if (!confirm("Remove custom wallpaper and revert to default?")) return;\
    setStatus("Removing...", null);\
    var sid = L.env.sessionid;\
    fetch("/ubus", {\
      method: "POST",\
      headers: { "Content-Type": "application/json" },\
      body: JSON.stringify({ jsonrpc:"2.0", id:1, method:"call",\
        params: [sid, "file", "remove", { path: BGPATH }] })\
    }).then(function(res) { return res.json(); })\
      .then(function(reply) {\
        if (reply && reply.result && reply.result[0] === 0) {\
          setStatus("Reverted to default wallpaper.", true);\
          hidePreview();\
        } else {\
          setStatus("Could not remove: check permissions", false);\
        }\
      }).catch(function(e) { setStatus("Could not remove: " + e.message, false); });\
  });\
})();\
</script>';

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

        /* ---- Toolbar tab – placeholder only, real table rendered below ---- */
        o = s.taboption('toolbar', form.DummyValue, '_toolbar_placeholder', '');
        o.rawhtml  = true;
        o.default  = '<div id="noobwrt-toolbar-tab-content"></div>';

        /* ---- About ---- */
        o = s.taboption('about', form.DummyValue, '_about', '');
        o.rawhtml = true;
        o.default = '\
<div style="max-width:480px;background:var(--color-bg-1,#fff);border:1px solid var(--color-border,#e5e7eb);border-radius:12px;padding:20px 24px;box-shadow:0 2px 8px rgba(0,0,0,0.06)">\
  <h3 style="margin:0 0 6px;font-size:16px;font-weight:600">NoobWrt Theme</h3>\
  <p style="margin:0 0 16px;color:#888;font-size:13px">A clean modern LuCI theme for OpenWrt routers.</p>\
  <table style="width:100%;border-collapse:collapse;line-height:1.9;font-size:13px">\
    <tr><td style="width:130px;color:#888;padding:3px 0">Developer</td>\
        <td><strong>NoobLk</strong></td></tr>\
    <tr><td style="color:#888;padding:3px 0">Repository</td>\
        <td><a href="https://github.com/nooblk-98/luci-theme-noobwrt" target="_blank" rel="noopener" style="color:#5e72e4">github.com/nooblk-98/luci-theme-noobwrt</a></td></tr>\
    <tr><td style="color:#888;padding:3px 0">Contributors</td>\
        <td><a href="https://github.com/nooblk-98/luci-theme-noobwrt/graphs/contributors" target="_blank" rel="noopener" style="color:#5e72e4">View on GitHub</a></td></tr>\
    <tr><td style="color:#888;padding:3px 0">License</td>\
        <td>MIT</td></tr>\
    <tr><td style="color:#888;padding:3px 0">Issues / Support</td>\
        <td><a href="https://github.com/nooblk-98/luci-theme-noobwrt/issues" target="_blank" rel="noopener" style="color:#5e72e4">Open an issue</a></td></tr>\
  </table>\
  <p style="margin:16px 0 0;color:#bbb;font-size:12px;text-align:center;border-top:1px solid var(--color-border,#e5e7eb);padding-top:12px">Made with \u2665 for the OpenWrt community</p>\
</div>';

        /* ============================================================
         * SECTION: Toolbar Panel Items (TableSection)
         * Rendered separately, then moved into the Toolbar tab via JS.
         * ============================================================ */
        var ts = m.section(form.TableSection, 'toolbar_item',
            _('Toolbar Panel Items'),
            _('Quick-access links displayed in the right-side toolbar panel on every page. ' +
              'Items are rendered in ascending Order number. ' +
              'Use the Add button below to create new entries.'));
        ts.addremove = true;
        ts.anonymous = true;
        ts.sortable  = false;
        ts.nodescriptions = true;

        o = ts.option(form.Flag, 'enabled', _('Enable'));
        o.default = '1';
        o.editable = true;

        o = ts.option(form.Value, 'title', _('Label'));
        o.placeholder = 'Home';
        o.rmempty = false;
        o.editable = true;

        o = ts.option(form.Value, 'url', _('URL / Path'));
        o.placeholder = '/cgi-bin/luci/admin/status/overview';
        o.rmempty = false;
        o.editable = true;

        o = ts.option(form.ListValue, 'icon', _('Icon'));
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

        o = ts.option(form.Value, 'order',
            _('Order'),
            _('Lower numbers appear first in the toolbar.'));
        o.datatype = 'uinteger';
        o.placeholder = '10';
        o.editable = true;

        return m.render().then(function (node) {
            /* Find the TableSection node (last .cbi-section inside the map) and
             * move it into the Toolbar tab placeholder div.  The section stays
             * part of the form so save/add/remove all keep working normally. */
            var tabContent = node.querySelector('#noobwrt-toolbar-tab-content');
            var sections   = node.querySelectorAll('.cbi-map > .cbi-section');
            /* The TableSection is always the last top-level section in the map */
            var tsNode = sections[sections.length - 1];

            if (tabContent && tsNode) {
                /* Strip the section heading since the tab label already names it */
                var heading = tsNode.querySelector('h3, .cbi-section-legend');
                if (heading) heading.style.display = 'none';
                tabContent.appendChild(tsNode);
            }

            /* Wire up tab clicks so the toolbar section shows/hides with its tab.
             * LuCI hides tab content via display:none on the wrapping div —
             * the TableSection node is now inside that div so it follows naturally.
             * No extra JS needed beyond the move above. */
            return node;
        });
    }
});
