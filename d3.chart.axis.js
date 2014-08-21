/*!
 * @copyright Copyright (c) 2014 Sentient Energy, Inc.
 * @license   Licensed under MIT license
 */
(function (d3) {
    /**
     * __Axis component for `d3.chart` v0.2 and `d3.chart.base` v0.4__
     *
     * Intended to be used as a component of a larger chart.  This mix-in
     * can determine the `axis.domain` scale if `domain([domain])` is set.
     *
     * __Basic usage__
     *
     * ```javascript
     * chart.xAxisMixin = chart.append("g").chart("Axis").axis(chart.xAxis());
     * ```
     *
     * __Customizing the CSS class and domain access method__
     *
     * ```javascript
     *    var yAxisPaddingScale = 1.1;
     *
     *    chart.yAxisMixin = chart.append("g").chart("Axis", {
     *        cssClass: "y"
     *    }).axis(chart.yAxis())
     *      .domain(function(data) {
     *            var yExtents = d3.extent(data, function(d) { return d[1]; });
     *            var yMaxAbs = d3.max(yExtents.map(Math.abs)) * yAxisPaddingScale;
     *            return [-yMaxAbs, yMaxAbs];
     *    });
     * ```
     *
     * @class Axis
     * @namespace d3.chart
     * @extends d3.chart.BaseChart
     * @author    Pete Baker
     * @version   0.1.0
     */
    d3.chart("BaseChart").extend("Axis", {

        /**
         * Initializes the chart.
         *
         * Creates a default `axis` object and axis chart layer.
         *
         * @constructor
         * @method initialize
         * @param {Boolean} [options.showLabels|true] flag indicating whether to show axis labels.
         */
        initialize: function(options) {
            var chart = this;

            console.log("[Axis] initialize", options);

            chart.showLabels = (options && options.showLabels !== undefined) ? options.showLabels : true;

            //create a default axis object
            this._axis = d3.svg.axis().orient("bottom");

            this.layer("axis", chart.base, {
                dataBind: function(data) {
                    chart.data = data;

                    //calculate the domain
                    if (chart._domain) {
                        var domain = chart._domain(data);

                        console.log("[Axis] transform domain:  %o", domain);

                        //set the domain in the axis scale
                        chart.axis().scale().domain(domain);
                    }

                    return this.selectAll("g").data([data]);
                },
                insert: function() {
                    return this.append("g").classed("axis", true);
                },
                events: {
                    "merge:transition": function() {
                        //hide the labels if necessary
                        if (! chart.showLabels) chart.axis().tickFormat("");

                        //draw the axis
                        this.call(chart._axis);
                    }
                }
            });
        },

        /**
         * Axis setter/getter.
         *
         * If `axis` is not supplied, the current `axis` value
         * is returned.
         *
         * @method axis
         * @param {d3.chart.axis} [axis] A ```d3.chart.axis```
         * instance.
         * @return {d3.chart.axis|this} The current ```d3.chart.axis``` instance if
         * no arguments are given, otherwise the chart instance.
         */
        axis: function(axis) {
            if (! axis) return this._axis;

            console.log("[Axis] set axis");

            this._axis = axis;
            return this;
        },

        /**
         * Sets/gets the domain access function.
         *
         * If `undefined`, the domain will not be calculated
         * when the axis control receives new data.
         *
         * @method domain
         * @param {function} [domain] Domain access function
         * which transforms x-axis data to the x-axis domain. May be ```undefined```.
         * @return {Function|this} The domain access function if no arguments are given,
         * otherwise the chart instance.
         */
        domain: function(domain) {
            if (!domain) return this._domain;

            console.log("[Axis] set domain");

            this._domain = domain;
            return this;
        }
    });
}(d3));
