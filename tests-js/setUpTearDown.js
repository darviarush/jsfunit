var i = 0

function setUp() {
	i++
}

function tearDown() {
	i--
}

function test1() {
	assertEquals(i, 1)
}

function test2() {
	assertEquals(i, 1)
}
