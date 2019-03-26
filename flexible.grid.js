(function (o) {
    if (!o) return;

    const defaultGridColumnHeight = 250;
    let gridCollection = [];

    function onLimit(first, last) {
        if (first)
            first.onCss('first');
        if (last)
            last.onCss('last');
    }
    function offLimit(first, last) {
        if (first)
            first.offCss('first');
        if (last)
            last.offCss('last');
    }


    function applyGridColumnSize(args) {
        let cols = args.coll.items;
        onLimit(cols[args.start].child, cols[args.end].child);
        let rowheight = applyRowHeight(args);
        for (var n = args.start; n <= args.end; n++) {
            const col = cols[n];
            col.child.setWH(rowheight * cols[n].width / cols[n].height, rowheight);
        }
    }

    function getFlexibleType(prop, isLast, value) {
        if (isLast) {
            switch (prop) {
                case 'flex':
                    return value * defaultGridColumnHeight;
                case 'compact':
                    return defaultGridColumnHeight;
                default:
                    {
                        if (typeof prop === 'string' && !isNaN(parseInt(prop))) {
                            return value * parseInt(prop);
                        }
                        return value * defaultGridColumnHeight;
                    }

            }
        } else {
            return value * defaultGridColumnHeight;
        }
    }

    function applyRowHeight(args) {
        let rowHeight = getFlexibleType(args.coll.flexible, args.isLast, args.gridWidth / args.rowWidth);
        return rowHeight;
    }

    function gridCalculate(collect) {

        let gridWidth = collect.grid.getBoundingClientRect().width;
        let gridRowWidthSize = 0;
        let gridItemIndex = 0;

        collect.items.collection(function (item, i) {

            offLimit(item.child);

            if (item.child.setting.complete) {
                gridRowWidthSize += defaultGridColumnHeight * item.width / item.height;

                let config = {
                    coll: collect,
                    start: gridItemIndex,
                    gridWidth: gridWidth,
                    rowWidth: gridRowWidthSize
                };

                /** Row */
                if (gridRowWidthSize > gridWidth) {

                    config.end = i;
                    config.isLast = false;

                    applyGridColumnSize(config);

                    /** Reset */
                    gridItemIndex = i + 1;
                    gridRowWidthSize = 0;
                }
                /** Last Row */
                else if (i == collect.items.length - 1 && gridRowWidthSize <= gridWidth) {

                    config.end = collect.items.length - 1;
                    config.isLast = true;

                    applyGridColumnSize(config);
                }
            }

        })
    }

    function getGridChildren(items, num) {
        let completeCount = 0;
        items.collection(function (child, childIndex) {
            if (child.isloaded) return;

            const a = child.children[0];
            const img = a.children[0];
            const imgSrc = img.getAttr('data-src');
            const imgElement = new Image();

            child.setH(defaultGridColumnHeight);

            child.setting = {
                lazy: true,
                complete: false
            };

            let config = { img: img, width: 0, height: 0, child: child };

            gridCollection[num].items.push(config);

            imgElement.onload = function () {
                child.setting.complete = true;
                img.src = imgSrc;
                config.width = this.width;
                config.height = this.height;
                completeCount += 1;
                if (completeCount >= items.length) {
                    resizeCollection();
                }
            }


            imgElement.src = imgSrc;

        });
    }

    function onDefineAttr(o, name) {
        Object.defineProperty(o, name, {
            get: function () {
                return o.grid.getAttr('data-' + name);
            }
        })
    }

    function resizeCollection() {
        gridCollection.collection(function (a, b) {
            gridCalculate(a);
        })
    }


    o.collection(function (it, num) {
        let config = { grid: it, items: [] };
        onDefineAttr(config, 'flexible');
        gridCollection.push(config);
        getGridChildren(it.children, num);
    });

    window.addEventListener('resize', resizeCollection, false);

})(document.querySelectorAll('.flexible.grid'));




