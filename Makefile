LESS    = ./less/pagelist.less
CSS     = ./css/pagelist.css
CSS_MIN = ./css/pagelist.min.css
DATE    = $(shell date +%I:%M%p)
CHECK   = \033[32m✔\033[39m
HR      =-------------------------------------------------------
DR      ========================================================


#
# COMPILE
# requires uglifyjs2, lessc and yui-compressor
#

compile:
	@echo "\n${DR}"
	@echo "Compiling scripts..."
	@echo "${HR}\n"
	@lessc ${LESS} > ${CSS}
	@echo "Compile LESS file document.less...          ${CHECK} Done"
	@yuicompressor ${CSS} > ${CSS_MIN}
	@echo "Minifying CSS document.css...               ${CHECK} Done"
	@r.js -o js/build.js
	@echo "Building JS pagelist.min.js...              ${CHECK} Done"
	@echo "\n${HR}"
	@echo "All assets successfully compiled at ${DATE}."
	@echo "${DR}\n"
