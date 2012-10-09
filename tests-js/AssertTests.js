function testAssertException() {
	assertException("assertException with string - fail!", "throw 1")
	assertException("assertException with function - fail!", function(){throw 1})
	assertNotException("assertNotException with string - fail!", "1+1")
	assertNotException("assertNotException with function - fail!", function(){1+1})	
}

function testAssert() {
	assert(true)
	assert("assert with true", true)
	assert("assert with string", 'str')
	assert("assert with number", 10)
	assert("assert", {})
	assert("assert", [])
	assertException("false", function(){ assert("assert", false) })
	assertException("''", function(){ assert("assert", '') })
	assertException("0", function(){ assert("assert", 0) })
}

function testAssertTrue() {
	assertTrue(true)
	assertTrue("with comment", true)
	assertException('1', function(){ assertTrue('1') })
	assertException('false', function(){ assertTrue(false) })
}

function testAssertFalse() {
	assertFalse(false)
	assertFalse("with comment", false)
	assertException("0", function(){ assertFalse(0)} )
	assertException("true", function(){ assertFalse(true) })
	assertException("''", function(){ assertFalse('') })
}

function testAssertEquals() {
	assertEquals(1, 1)
	assertEquals('with undefined', undefined, undefined)
	assertEquals('with ""', '', '')
	assertEquals('"10"=10', '10', 10)
	assertException("1!=10", function(){ assertEquals(1, 10) })
	assertException("NaN!=10", function(){ assertEquals(NaN, 10) })
	assertException("NaN!=NaN", function(){ assertEquals(NaN, NaN) })
}

function testAssertNotEquals() {
	assertNotEquals(1, 2)
	assertNotEquals('undefined!=1', undefined, 1)
	assertNotEquals({}, {})
	assertNotEquals([], [])
	assertException("''!=0", function(){ assertNotEquals("", 0) })
}

function testAssertIdentity() {
	assertIdentity(1, 1)
	assertIdentity('null===null', null, null)
	assertException("''!==0", function(){ assertIdentity('', 0) })
}

function testAssertNotIdentity() {
	var a = b = {}
	assertNotIdentity('', 0)
	assertNotIdentity('a!=={}', a, {})
	assertException("a===b", function(){ assertNotIdentity(a, b) })
}

function assertNull() {
	assertNull(null)
	assertNull('w.c.', null)
	assertException('""', assertNull(''))
	assertException('0', assertNull(0))
}

function assertUndefined() {
	assertUndefined(undefined)
	assertUndefined('w.c.', undefined)
	assertException('""', assertUndefined(''))
	assertException('0', assertUndefined(0))
}

function assertNaN() {
	assertNaN(NaN)
	assertNaN('w.c.', NaN)
	assertException('""', assertNaN(''))
	assertException('0', assertNaN(0))
}

function testFail() {
	assertException('fail("hi!")')
}

function testWarn() {
	info("this info")
	inform("this inform")
	debug("this debug")
	warn("this warn")
	inform("info", '"val"')
	debug("debug", {x:10, y:[1,2,3]})
	warn("warn", "'val'")
}