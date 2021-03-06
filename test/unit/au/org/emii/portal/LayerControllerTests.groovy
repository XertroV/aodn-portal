
/*
 * Copyright 2012 IMOS
 *
 * The AODN/IMOS Portal is distributed under the terms of the GNU General Public License
 *
 */

package au.org.emii.portal

import grails.test.ControllerUnitTestCase
import org.codehaus.groovy.grails.web.json.JSONElement

class LayerControllerTests extends ControllerUnitTestCase {

    def validConfig = new Config( wmsScannerCallbackPassword: "pwd" )
    def messageArgs

    protected void setUp() {
        super.setUp()

        controller.metaClass.message = { LinkedHashMap args -> messageArgs = args }
        controller.metaClass._recache = {}
    }

    void testIndex() {
            this.controller.index()
            assertEquals "list", this.controller.redirectArgs["action"]
    }

    void testSaveOrUpdate() {

        String metadata = '{metaDataElement: "metaData", serverUri: "http://serverUriText.com", dataSource:"testDataSource"}'
        this.controller.params.password = "pwd"
        this.controller.params.metadata = metadata
        this.controller.params.capabilitiesData = "012345678901234567890123456789001234567890123456789012345678901234567890123456789012345678901234567890123456789"

        UserRole role = new UserRole(name: "ServerOwner", id:  100)
        mockDomain UserRole, [role]
        UserRole.metaClass.findByName{
            return role
        }

        User user = new User(id:  100, roles: [role])
        mockDomain User, [user]

		def server = new Server(id : 10, uri : "http://serverUriText.com", shortAcron : "A", name : "name1", type : "WMS-1.1.1", lastScanDate: null, scanFrequency : 0, disable : false, allowDiscoveries : true, opacity : 3, imageFormat : "image/png", infoFormat: 'text/html', comments : "", owners: [user] )
		mockDomain Server, [server]
		mockDomain Config, [validConfig]


		def mockLayer = new Layer()
		def layerServiceControl = mockFor(LayerService)
		layerServiceControl.demand.updateWithNewData(1..1) { JSONElement e, Server s, String ds -> mockLayer }
		this.controller.layerService = layerServiceControl.createMock()

		this.controller.saveOrUpdate()

		assertNotNull "Server should now have a lastScanDate", server.lastScanDate

		assertEquals "Response text should match", "Complete (saved)", controller.response.contentAsString
    }

	void testToResponseMap() {
		def data = ['a', 'b', 'c', 'd', 'e', 'f']
		def response = this.controller._toResponseMap(data, data.size())
		assertEquals data, response.data
		assertEquals data.size(), response.total
	}

	void testIsServerCollectable() {
		assertFalse this.controller._isServerCollectable(null, null)

		def server1 = new Server()
		server1.id  = 1
		assertTrue this.controller._isServerCollectable(null, server1)
		assertFalse this.controller._isServerCollectable(server1, server1)
		assertFalse this.controller._isServerCollectable(server1, null)

		def server2 = new Server()
		server2.id  = 2
		assertTrue this.controller._isServerCollectable(server1, server2)
	}

	void testCollectServer() {
		def items = []

		def server1 = new Server()
		server1.id  = 1
		def result = this.controller._collectServer(null, server1, items)
		assertEquals result, server1
		assertEquals 1, items.size()

		result = this.controller._collectServer(result, server1, items)
		assertEquals result, server1
		assertEquals 1, items.size()

		def server2 = new Server()
		server2.id  = 2
		result = this.controller._collectServer(result, server2, items)
		assertEquals result, server2
		assertEquals 2, items.size()
	}

	void testCollectLayersAndServers() {
		def servers = _buildServers(1, 4)
		def layers = []
		servers.eachWithIndex { server, i ->
			layers.addAll(_buildLayers(1 + (i * 10), server, 10))
		}

		def result = this.controller._collectLayersAndServers(layers)
		assertEquals 44, result.size()
	}

    void testGetFiltersAsJson(){
        def server1 = new Server()
        server1.id = 1

        def layer1 = new Layer()
        layer1.id = 3
        layer1.server = server1

        def filter1 = new Filter(name: "vesselName", type: FilterType.String, label: "Vessel Name", possibleValues: ["ship1", "ship2", "ship3"], layer: layer1, enabled: true)
        def filter2 = new Filter(name: "sensorType", type: FilterType.String, label: "Sensor Type", possibleValues: ["type1", "type2"], layer: layer1, enabled: true)
	    def filter3 = new Filter(name: "disabled filter", type: FilterType.String, label: "Sensor Type", possibleValues: ["type1", "type2"], layer: layer1, enabled: false)

        layer1.filters = [filter1, filter2, filter3]

        mockDomain(Server, [server1])
        mockDomain(Layer, [layer1])
        mockDomain(Filter, [filter1, filter2, filter3])

        //test layer with filters
        this.controller.params.layerId = 3
        this.controller.getFiltersAsJSON()

	    def response = this.controller.response.contentAsString

        assertTrue response.contains("""{"label":"Vessel Name","type":"String","name":"vesselName","possibleValues":["ship1","ship2","ship3"],"layerId":3,"enabled":true}""")
        assertTrue response.contains("""{"label":"Sensor Type","type":"String","name":"sensorType","possibleValues":["type1","type2"],"layerId":3,"enabled":true}""")
	    assertFalse response.contains("disabled filter")
    }

    void testGetLayerWithoutFilters(){
        def server1 = new Server()
        server1.id = 1

        def layer2 = new Layer()
        layer2.id = 4
        layer2.server = server1

        mockDomain(Server, [server1])
        mockDomain(Layer, [layer2])

        //test layer WITHOUT any filters
        this.controller.params.layerId = 4
        this.controller.getFiltersAsJSON()

        def expected = "[]"
        assertEquals expected, this.controller.response.contentAsString
    }

    void testUpdateNoViewParams() {
        _updateViewParamsSetup()
        def updatedLayer = Layer.get(controller.redirectArgs['id'])
        assertNotNull(updatedLayer)
        assertNull(updatedLayer.viewParams)
    }

    void testUpdateFullViewParams() {
        _updateViewParamsSetup([centreLat: 12f, centreLon: 54f, openLayersZoomLevel: 5])

        def updatedLayer = Layer.get(controller.redirectArgs['id'])
        assertNotNull(updatedLayer)
        assertNotNull(updatedLayer.viewParams)
        assertEquals(12f, updatedLayer.viewParams.centreLat)
        assertEquals(54f, updatedLayer.viewParams.centreLon)
        assertEquals(5, updatedLayer.viewParams.openLayersZoomLevel)
    }

    void testUpdateFullThenNoViewParams() {
        _updateViewParamsSetup([centreLat: 12f, centreLon: 54f, openLayersZoomLevel: 5])
        def updatedLayer = Layer.get(controller.redirectArgs['id'])
        assertNotNull(updatedLayer)
        assertNotNull(updatedLayer.viewParams)

        _updateViewParamsSetup()
        updatedLayer = Layer.get(controller.redirectArgs['id'])
        assertNotNull(updatedLayer)
        assertNull(updatedLayer.viewParams)
    }

    def _updateViewParamsSetup(viewParams) {
        Layer layer = new Layer(dataSource: "abc", server: new Server())
        mockDomain(Layer, [layer])
        mockDomain(LayerViewParameters)

        layer.save(failOnError: true)

        assertNotNull(layer.id)
        controller.params.id = layer.id
        controller.params.viewParams = viewParams

        controller.update()

        return layer
    }

	def _buildServers(sId, number) {
		def servers = []
		for (def i = 0; i < number; i++) {
			def server = new Server()
			server.id = sId + i
			servers.add(server)
		}
		return servers
	}

	def _buildLayers(sLayerId, server, number) {
		def layers = []
		for (def i = 0; i < number; i++) {
			def layer = new Layer()
			layer.id = sLayerId + i
			layer.server = server
			layers.add(layer)
		}
		return layers
	}
}
