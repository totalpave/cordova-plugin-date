module.exports = {
	LIBRARY_SEARCH_PATHS: 'LIBRARY_SEARCH_PATHS',
	// If TRUE_TIME ever requires a second search path, we could either make this into an array or add another TRUE_TIME_X constant.
	SWIFT_LIBRARY_SEARCH_PATH: '"$(TOOLCHAIN_DIR)/usr/lib/swift/$(PLATFORM_NAME)"'
};
