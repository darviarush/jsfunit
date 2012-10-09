// uncomment loading frame and window. loading frame and window need many time.

//frame f1 "tests-js/importTest/frame1.html"
//open win1 "tests-js/importTest/frame1.html"
import "tests-js/importTest/import1.mjs"
//open win2 "tests-js/importTest/frame2.html" "left=10000,width=200,height=150,scroll"
import "tests-js/importTest/import2.mjs"
//frame f2 "tests-js/importTest/frame2.html"

function testImport() {
	assertIdentity("`tests-js/importTest/import1.mjs' not loaded with helped `import'", typeof(test1), "function")
    assertIdentity("`tests-js/importTest/import2.mjs' not loaded with helped `import'", typeof(test2), "function")
    //assertIdentity("`tests-js/importTest/frame1.html' not loaded with helped `frame'", f1.document.getElementById("text_field1").value, "xyz")
    //assertIdentity("`tests-js/importTest/frame2.html' not loaded with helped `frame'", f2.document.getElementById("text_field2").value, "12")
    //assertIdentity("`tests-js/importTest/frame1.html' not loaded with helped `open'", win1.document.getElementById("text_field1").value, "xyz")
    //assertIdentity("`tests-js/importTest/frame2.html' not loaded with helped `open'", win2.document.getElementById("text_field2").value, "12")
}
