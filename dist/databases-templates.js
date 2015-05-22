angular.module('databases.templates', ['databases/databases-list.tpl.html']);

angular.module("databases/databases-list.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("databases/databases-list.tpl.html",
    "<div class=\"page-header\"><h1>Databases</h1></div>\n" +
    "\n" +
    "<div class=\"row\">\n" +
    "    <div class=\"col-md-3 col-md-push-9\">\n" +
    "        <form class=\"facets-form\">\n" +
    "            <div class=\"form-group\">\n" +
    "                <span class=\"page-header\">\n" +
    "                    <h4>Filter Databases By</h4>\n" +
    "                </span>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <input type=\"text\" class=\"form-control\" ng-model=\"db.search\" placeholder=\"Keyword search\">\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group hidden-xs\">\n" +
    "                <h5>Title starts with</h5>\n" +
    "                <div class=\"facet-group alphanum-group\">\n" +
    "                    <div class=\"btn-group\">\n" +
    "                        <label class=\"btn btn-default\" ng-repeat=\"na in numAlpha\" ng-model=\"db.startsWith\" btn-radio=\"'{{na}}'\" ng-disabled=\"startsWithDisabled[na]\" uncheckable>{{na}}</label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group hidden-xs\">\n" +
    "                <h5>Subjects</h5>\n" +
    "                <div class=\"facet-group\">\n" +
    "                    <div class=\"radio\" ng-class=\"{'disabled': subj.disabled}\" ng-repeat=\"subj in subjects\">\n" +
    "                        <label>\n" +
    "                            <input type=\"checkbox\" ng-model=\"db.subjects[subj.subject]\" ng-disabled=\"subj.disabled\">\n" +
    "                            {{subj.subject}} ({{subj.total}})\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "\n" +
    "            <div class=\"form-group hidden-xs\">\n" +
    "                <h5>Types</h5>\n" +
    "                <div class=\"facet-group\">\n" +
    "                    <div class=\"radio\" ng-class=\"{'disabled': type.disabled}\" ng-repeat=\"type in types\">\n" +
    "                        <label>\n" +
    "                            <input type=\"checkbox\" ng-model=\"db.types[type.type]\"  ng-disabled=\"type.disabled\">\n" +
    "                            {{type.type}} ({{type.total}})\n" +
    "                        </label>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"form-group\">\n" +
    "                <button type=\"button\" class=\"btn btn-block btn-primary\" ng-click=\"resetFilters()\"><span class=\"fa fa-fw fa-refresh\"></span> Reset filters</button>\n" +
    "            </div>\n" +
    "        </form>\n" +
    "    </div>\n" +
    "    <div class=\"col-md-9 col-md-pull-3 databases-list-container\">\n" +
    "        <p>\n" +
    "        Showing {{pager.page}}-{{pager.page*pager.perPage}} of {{pager.totalItems}} results\n" +
    "        <ol class=\"breadcrumb\" ng-if=\"activeFilters.startsWith || activeFilters.subjects || activeFilters.types\">\n" +
    "            <li ng-if=\"activeFilters.startsWith\"><strong>Starts with:</strong> <button type=\"button\" class=\"btn btn-default\" ng-click=\"db.startsWith = ''\">\"{{db.startsWith}}\" <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "            <li ng-if=\"activeFilters.subjects\"><strong>Subjects:</strong> <button type=\"button\" class=\"btn btn-default\" ng-click=\"db.subjects[subject] = false\" ng-repeat=\"(subject, key) in db.subjects\">{{subject}} <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "            <li ng-if=\"activeFilters.types\"><strong>Types:</strong> <button type=\"button\" class=\"btn btn-default\" ng-click=\"db.types[type] = false\" ng-repeat=\"(type, key) in db.types\">{{type}} <span class=\"text-muted\" aria-hidden=\"true\">&times;</span></button></li>\n" +
    "        </ol>\n" +
    "        </p>\n" +
    "\n" +
    "        <div class=\"media\" ng-repeat=\"item in filteredDB | filter:{disabled: 0} | after:(pager.page-1)*pager.perPage | limitTo:20\">\n" +
    "            <div class=\"media-body\">\n" +
    "                <h4 class=\"media-heading\">\n" +
    "                    <a ng-href=\"{{DB_PROXY_PREPEND_URL}}{{item.url}}\" title=\"{{item.title}}\"> {{item.title}}</a>\n" +
    "                    <!--<small ng-if=\"item.presentedBy\">({{item.presentedBy}})</small>-->\n" +
    "                    <small>{{item.coverage}}</small>\n" +
    "                    <small>\n" +
    "                        <span class=\"label label-success\" ng-if=\"item.hasFullText == 'A'\">All Full Text</span>\n" +
    "                        <span class=\"label label-info\" ng-if=\"item.hasFullText == 'P'\">Primarily Full Text</span>\n" +
    "                        <span class=\"label label-warning\" ng-if=\"item.hasFullText == 'S'\">Some Full Text</span>\n" +
    "                        <span class=\"label label-danger\" ng-if=\"item.hasFullText == 'N'\">No Full Text</span>\n" +
    "                    </small>\n" +
    "                </h4>\n" +
    "\n" +
    "                <p>{{item.description}}</p>\n" +
    "\n" +
    "\n" +
    "                <div ng-if=\"item.location\">\n" +
    "                    <strong>Access:</strong> {{item.location}}\n" +
    "                </div>\n" +
    "                <div ng-if=\"(item.subjects | where:{type:1}).length > 0\">\n" +
    "                    <strong>Primary subjects: </strong><span ng-repeat=\"subj in item.subjects | where:{type:1}\">{{subj.subject}}</span>\n" +
    "                </div>\n" +
    "                <div ng-if=\"item.types\">\n" +
    "                    <strong>Types of material: </strong><span ng-repeat=\"type in item.types\">{{type.type}}</span>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"text-center\">\n" +
    "            <pagination class=\"pagination-sm\" ng-model=\"pager.page\" total-items=\"pager.totalItems\" max-size=\"pager.maxSize\" boundary-links=\"true\" rotate=\"false\" items-per-page=\"pager.perPage\" ng-change=\"pageChange()\" ng-if=\"pager.totalItems > pager.perPage\"></pagination>\n" +
    "        </div>\n" +
    "\n" +
    "        <div class=\"alert alert-warning text-center\" role=\"alert\" ng-show=\"pager.totalItems < 1\">\n" +
    "            <h2>No results found <span ng-if=\"db.search\"> for \"{{db.search}}\"</span></h2>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);
