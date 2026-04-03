<!-- markdownlint-configure-file {
  "MD013": {
    "code_blocks": false,
    "tables": false,
    "line_length":200
  },
  "MD033": false,
  "MD041": false
} -->

[license]: /LICENSE
[license-badge]: https://img.shields.io/github/license/nooblk-98/luci-theme-noobwrt?style=flat-square&a=1
[prs]: https://github.com/nooblk-98/luci-theme-noobwrt/pulls
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[issues]: https://github.com/nooblk-98/luci-theme-noobwrt/issues/new
[issues-badge]: https://img.shields.io/badge/Issues-welcome-brightgreen.svg?style=flat-square
[release]: https://github.com/nooblk-98/luci-theme-noobwrt/releases
[release-badge]: https://img.shields.io/github/v/release/nooblk-98/luci-theme-noobwrt?style=flat-square
[download]: https://github.com/nooblk-98/luci-theme-noobwrt/releases
[download-badge]: https://img.shields.io/github/downloads/nooblk-98/luci-theme-noobwrt/total?style=flat-square
[contact]: https://t.me/jerryk6
[contact-badge]: https://img.shields.io/badge/Contact-telegram-blue?style=flat-square
[en-us-link]: /README.md
[zh-cn-link]: /README_ZH.md
[en-us-release-log]: /RELEASE.md
[zh-cn-release-log]: /RELEASE_ZH.md
[config-link]: https://github.com/jerrykuku/luci-app-noobwrt-config/releases
[lede]: https://github.com/coolsnowwolf/lede
[official]: https://github.com/openwrt/openwrt
[immortalwrt]: https://github.com/immortalwrt/immortalwrt


# A brand new LuCI theme NoobWRT

NoobWrt is <strong>a clean and tidy OpenWrt LuCI theme</strong> that allows users to customize their login interface with images or videos.  It also supports automatic and manual switching between light and dark modes.


<p align="center">
  <a href="https://github.com/nooblk-98/luci-theme-noobwrt/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/nooblk-98/luci-theme-noobwrt?style=flat-square&a=1" alt="license">
  </a>
  <a href="https://github.com/nooblk-98/luci-theme-noobwrt/pulls">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="prs">
  </a>
  <a href="https://github.com/nooblk-98/luci-theme-noobwrt/issues/new">
    <img src="https://img.shields.io/badge/Issues-welcome-brightgreen.svg?style=flat-square" alt="issues">
  </a>
  <a href="https://github.com/nooblk-98/luci-theme-noobwrt/releases">
    <img src="https://img.shields.io/github/v/release/nooblk-98/luci-theme-noobwrt?style=flat-square" alt="release">
  </a>
  <a href="https://github.com/nooblk-98/luci-theme-noobwrt/releases">
    <img src="https://img.shields.io/github/downloads/nooblk-98/luci-theme-noobwrt/total?style=flat-square" alt="download">
  </a>
</p>


<img src="screenshots/bg.png">
</div>

## luci-theme-noobwrt

> **About this theme **
>
> "NoobWRT Theme is a modern and extensively customized OpenWrt LuCI theme with unique features and enhancements specifically designed for the NoobWrt firmware. This is now an independent project providing a clean, modern, and highly customizable interface for your OpenWrt router, with a focus on user experience and visual appeal."
>
> Originally inspired by luci-theme-argon, this project has evolved into its own distinctive theme with unique features and continuous improvements.



## Getting started


### Build for OpenWrt official SnapShots and ImmortalWrt

```bash
cd openwrt/package
git clone https://github.com/nooblk-98/luci-theme-noobwrt.git
make menuconfig #choose LUCI->Theme->Luci-theme-noobwrt
make -j1 V=s
```

## Credits

[luci-theme-material](https://github.com/LuttyYang/luci-theme-material/)
[luci-theme-argon](https://github.com/jerrykuku/luci-theme-argon/)



