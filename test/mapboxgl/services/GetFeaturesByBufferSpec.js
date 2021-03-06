require('../../../src/mapboxgl/services/FeatureService');
var mapboxgl = require('mapbox-gl');
require('../../../src/common/util/FetchRequest');

var url = "http://supermap:8090/iserver/services/data-world/rest/data";
describe('mapboxgl_FeatureService_getFeaturesByBuffer', function () {
    var serviceResult = null;
    var originalTimeout;
    var FetchRequest = SuperMap.FetchRequest;
    beforeEach(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
    });
    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
        serviceResult = null;
    });

    //数据集Buffer查询服务
    it('getFeaturesByBuffer_geometry', function (done) {
        var queryBufferGeometry = {
            "type": "Polygon",
            "coordinates": [[[-20, 20], [-20, -20], [20, -20], [20, 20], [-20, 20]]]
        };
        var bufferParam = new SuperMap.GetFeaturesByBufferParameters({
            datasetNames: ["World:Capitals"],
            bufferDistance: 10,
            geometry: queryBufferGeometry,
            fromIndex: 1,
            toIndex: 3
        });
        var service = new mapboxgl.supermap.FeatureService(url);
        spyOn(FetchRequest, 'commit').and.callFake(function (method, testUrl, params, options) {
            expect(method).toBe('POST');
            expect(testUrl).toBe(url + "/featureResults.json?returnContent=true&fromIndex=1&toIndex=3");
            expect(options).not.toBeNull();
            return Promise.resolve(new Response(getFeasByBuffer));
        });
        service.getFeaturesByBuffer(bufferParam, function (testResult) {
            serviceResult = testResult;
            expect(service).not.toBeNull();
            expect(serviceResult.type).toBe("processCompleted");
            expect(serviceResult.object.format).toBe("GEOJSON");
            var result = serviceResult.result;
            expect(result.succeed).toBe(true);
            expect(result.featureCount).toEqual(29);
            expect(result.totalCount).toEqual(29);
            expect(serviceResult.result.features.type).toEqual("FeatureCollection");
            var features = result.features.features;
            expect(features.length).toEqual(3);
            expect(features[0].id).toEqual(18);
            expect(features[1].id).toEqual(19);
            expect(features[2].id).toEqual(20);
            for (var i = 0; i < features.length; i++) {
                expect(features[i].type).toEqual("Feature");
                expect(features[i].properties).not.toBeNull();
                expect(features[i].geometry.type).toEqual("Point");
                expect(features[i].geometry.coordinates.length).toEqual(2);
            }
            bufferParam.destroy();
            done();
        });
    });
});