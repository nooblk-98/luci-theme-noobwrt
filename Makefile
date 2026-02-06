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

define Package/luci-theme-noobwrt/conffiles
/etc/config/luci
endef

define Build/Prepare
	$(call Build/Prepare/Default)
	$(CP) ./src/* $(PKG_BUILD_DIR)/
endef

define Build/Compile
	$(call LuCI/CompileCss,$(PKG_BUILD_DIR)/htdocs/luci-static/noobwrt/css)
endef

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
