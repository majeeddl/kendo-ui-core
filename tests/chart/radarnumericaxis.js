(function() {
    return;

    var dataviz = kendo.dataviz,
        deepExtend = kendo.deepExtend,
        getElement = dataviz.getElement,
        Point2D = dataviz.Point2D,
        Box2D = dataviz.Box2D,
        chartBox = new Box2D(100, 100, 500, 500),
        center = new Point2D(300, 300),
        view,
        axis,
        altAxis,
        TOLERANCE = 1;

    function createAxis(options) {
        altAxis = {
            box: chartBox,
            majorIntervals: function() {
                return [90, 210, 330];
            },
            majorAngles: function() {
                return this.majorIntervals();
            }
        };

        axis = new dataviz.RadarNumericAxis(1, 3,
            deepExtend({
                min: 0,
                max: 3,
                majorUnit: 1
            }, options)
        );

        axis.reflow(new Box2D(300, 0, 310, 310));
        axis.plotArea = {
            options: {},
            polarAxis: altAxis
        };

        view = new ViewStub();
        axis.getViewElements(view);
    }

    // ------------------------------------------------------------
    module("Radar Numeric Axis / Grid lines", {
        setup: function() {
            createAxis();
            axis.renderGridLines(view, altAxis);
        }
    });

    test("renders major grid lines by default", function() {
        equal(view.log.path.length, 3);
    });

    test("points are placed on alt axis intervals", function() {
        var points = view.log.path[0].points;

        close(points[0].x, 300, TOLERANCE);
        close(points[0].y, 204, TOLERANCE);

        close(points[1].x, 383, TOLERANCE);
        close(points[1].y, 348, TOLERANCE);

        close(points[2].x, 217, TOLERANCE);
        close(points[2].y, 348, TOLERANCE);
    });

    test("applies major grid line color", function() {
        createAxis({ majorGridLines: { color: "red" } });
        axis.renderGridLines(view, altAxis);

        equal(view.log.path[0].style.stroke, "red");
    });

    test("applies major grid line width", function() {
        createAxis({ majorGridLines: { width: 2 } });
        axis.renderGridLines(view, altAxis);

        equal(view.log.path[0].style.strokeWidth, 2);
    });

    test("renders minor grid lines", function() {
        createAxis({
            majorGridLines: {
                visible: false
            },
            minorGridLines: {
                visible: true
            }
        });
        axis.renderGridLines(view, altAxis);

        equal(view.log.path.length, 15);
    });

    test("applies minor grid line color", function() {
        createAxis({
            majorGridLines: {
                visible: false
            },
            minorGridLines: {
                visible: true,
                color: "red"
            }
        });
        axis.renderGridLines(view, altAxis);

        equal(view.log.path[0].style.stroke, "red");
    });

    test("applies minor grid line width", function() {
        createAxis({
            majorGridLines: {
                visible: false
            },
            minorGridLines: {
                visible: true,
                width: 4
            }
        });
        axis.renderGridLines(view, altAxis);

        equal(view.log.path[0].style.strokeWidth, 4);
    });

    // ------------------------------------------------------------
    module("Radar Numeric Axis / Grid arcs", {
        setup: function() {
            createAxis({
                majorGridLines: {
                    type: "arc"
                }
            });
            axis.renderGridLines(view, altAxis);
        }
    });

    test("renders major grid arcs", function() {
        equal(view.log.circle.length, 3);
    });

    test("circle center is on alt axis center", function() {
        var c = view.log.circle[0].c;

        close(c.x, 300, TOLERANCE);
        close(c.y, 300, TOLERANCE);
    });

    test("circle radius matches value", function() {
        close(view.log.circle[0].r, 96, TOLERANCE);
        close(view.log.circle[1].r, 194, TOLERANCE);
        close(view.log.circle[2].r, 292, TOLERANCE);
    });

    test("applies major grid line color", function() {
        createAxis({ majorGridLines: { type: "arc", color: "red" } });
        axis.renderGridLines(view, altAxis);

        equal(view.log.circle[0].style.stroke, "red");
    });

    test("applies major grid line width", function() {
        createAxis({ majorGridLines: { type: "arc", width: 2 } });
        axis.renderGridLines(view, altAxis);

        equal(view.log.circle[0].style.strokeWidth, 2);
    });

    test("renders minor grid arcs", function() {
        createAxis({
            majorGridLines: {
                visible: false
            },
            minorGridLines: {
                type: "arc",
                visible: true
            }
        });
        axis.renderGridLines(view, altAxis);

        equal(view.log.circle.length, 15);
    });

    test("applies minor grid line color", function() {
        createAxis({
            majorGridLines: { visible: false },
            minorGridLines: { visible: true, type: "arc", color: "red" }
        });

        axis.renderGridLines(view, altAxis);

        equal(view.log.circle[0].style.stroke, "red");
    });

    test("applies minor grid line width", function() {
        createAxis({
            majorGridLines: { visible: false },
            minorGridLines: { visible: true, type: "arc", width: 2 }
        });

        axis.renderGridLines(view, altAxis);

        equal(view.log.circle[0].style.strokeWidth, 2);
    });

    // ------------------------------------------------------------
    module("Radar Numeric Axis / Plot Bands / Polygons", {
        setup: function() {
            createAxis({
                line: {
                    visible: false
                },
                majorTicks: {
                    visible: false
                },
                plotBands: [{
                    from: 0,
                    to: 1,
                    opacity: 0.5,
                    color: "red"
                }]
            });
        }
    });

    test("renders polygon", function() {
        equal(view.log.path[0].points.length, 8);
    });

    test("polygon is closed", function() {
        equal(view.log.path[0].closed, true);
    });

    test("polygon points are on circle", function() {
        arrayClose(mapPoints(view.log.path[0].points), [
            [300, 204], [383, 348], [217, 348], [300, 204],
            [302, 299], [298, 299], [300, 302], [302, 298]
        ], TOLERANCE);
    });

    test("renders color", function() {
        equal(view.log.path[0].style.fill, "red");
    });

    test("renders opacity", function() {
        equal(view.log.path[0].style.fillOpacity, 0.5);
    });

    test("renders z index", function() {
        equal(view.log.path[0].style.zIndex, -1);
    });

    // ------------------------------------------------------------
    module("Radar Numeric Axis / Plot Bands / Arcs", {
        setup: function() {
            createAxis({
                majorGridLines: {
                    type: "arc"
                },
                plotBands: [{
                    from: 1,
                    to: 2,
                    opacity: 0.5,
                    color: "red"
                }]
            });
        }
    });

    test("renders ring", function() {
        equal(view.log.ring.length, 1);
    });

    test("ring inner radius", function() {
        close(view.log.ring[0].ring.ir, 96, TOLERANCE);
    });

    test("ring outer radius", function() {
        close(view.log.ring[0].ring.r, 194, TOLERANCE);
    });

    test("renders color", function() {
        equal(view.log.ring[0].style.fill, "red");
    });

    test("renders opacity", function() {
        equal(view.log.ring[0].style.fillOpacity, 0.5);
    });

    test("renders z index", function() {
        equal(view.log.ring[0].style.zIndex, -1);
    });

    // ------------------------------------------------------------
    module("Radar Numeric Axis / getValue", {
        setup: function() {
            createAxis();
        }
    });

    test("value for point on axis", function() {
        var p = Point2D.onCircle(center, 90, 100);
        close(axis.getValue(p), 1, 0.02);
    });

    test("value for point on major gridline", function() {
        var p = Point2D.onCircle(center, 210, 100);
        close(axis.getValue(p), 1, 0.02);
    });

    test("value for point between gridlines (middle)", function() {
        var p = Point2D.onCircle(center, 135, 50);
        close(axis.getValue(p), 1, 0.02);
    });

    test("value for point between gridlines (near first)", function() {
        var p = Point2D.onCircle(center, 110, 65);
        close(axis.getValue(p), 1, 0.02);
    });

    test("value for point between gridlines (near second)", function() {
        var p = Point2D.onCircle(center, 190, 65);
        close(axis.getValue(p), 1, 0.02);
    });

    // ------------------------------------------------------------
    module("Radar Numeric Axis / getValue / Arcs", {
        setup: function() {
            createAxis({
                majorGridLines: {
                    type: "arc"
                }
            });
        }
    });

    test("value for point on axis", function() {
        var p = Point2D.onCircle(center, 90, 100);
        close(axis.getValue(p), 1, 0.02);
    });

    test("value for point on gridline", function() {
        var p = Point2D.onCircle(center, 210, 100);
        close(axis.getValue(p), 1, 0.02);
    })

    test("value for point between gridline", function() {
        var p = Point2D.onCircle(center, 145, 100);
        close(axis.getValue(p), 1, 0.02);
    });;

    (function() {
        var chart,
            label,
            plotArea;

        function axisLabelClick(clickHandler, options) {
            chart = createChart($.extend(true, {
                series: [{
                    type: "radarColumn",
                    field: "value"
                }],
                axisLabelClick: clickHandler
            }, options));

            plotArea = chart._model.children[1];
            label = plotArea.valueAxis.labels[1];
            clickChart(chart, getElement(label.options.id));
        }

        // ------------------------------------------------------------
        module("Radar Numeric Axis / Events / axisLabelClick", {
            teardown: destroyChart
        });

        test("fires when clicking axis labels", 1, function() {
            axisLabelClick(function() { ok(true); });
        });

        test("event arguments contain axis options", 1, function() {
            axisLabelClick(function(e) {
                equal(e.axis.type, "numeric");
            });
        });

        test("event arguments contain DOM element", 1, function() {
            axisLabelClick(function(e) {
                equal(e.element.length, 1);
            });
        });

        test("event arguments contain index", 1, function() {
            axisLabelClick(function(e) {
                equal(e.index, 1);
            });
        });

        test("event arguments contain value", 1, function() {
            axisLabelClick(function(e) {
                equal(e.value, 0.2);
            });
        });
    })();

})();
