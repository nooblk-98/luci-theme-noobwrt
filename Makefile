#
# Copyright (C) 2008-2019 Jerrykuku
# Copyright (C) 2022-2025 SMALLPROGRAM
#
# This is free software, licensed under the Apache License, Version 2.0 .
#

include $(TOPDIR)/rules.mk

PKG_NAME:=luci-theme-noobwrt
LUCI_TITLE:=NoobWRT Theme for LuCI
LUCI_DEPENDS:=+wget +jsonfilter
PKG_VERSION:=1.1.0
PKG_RELEASE:=20250722
LUCI_PKGARCH:=all
LUCI_MINIFY:=0

include $(TOPDIR)/feeds/luci/luci.mk

# Theme is pre-built/static assets; no compile/install steps needed
define Build/Compile
endef

define Build/Install
endef

# call BuildPackage - OpenWrt buildroot signature
