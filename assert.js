// Библиотека проверок

//assert([комментарий], условие)	Если условие ложно, то прекращает выполнение теста и выводит ошибку в лог с комментарием, если комментарий указан. Условие должно быть выражением возвращающим значение типа boolean. Пример: assert("Страшная ошибка!!!", a==10 || x<2) 
function assert () {
	if(!arguments[arguments.length-1]) throw arguments[arguments.length-2]
}

// assertTrue([комментарий], условие) 	ошибка, если условие не истинно
function assertTrue () {
	if(arguments[arguments.length-1]!==true) throw arguments[arguments.length-2]
}

//assertFalse([комментарий], условие) 	ошибка, если условие не ложно
function assertFalse () {
	if(arguments[arguments.length-1]!==false) throw arguments[arguments.length-2]
}

//assertEquals([комментарий], ожидаемое_значение, полученное_значение) 	ошибка, если полученное значение не совпадает с ожидавшимся 
function assertEquals () {
	if(arguments[arguments.length-2]!=arguments[arguments.length-1]) 
		throw arguments[arguments.length-2]+'!='+arguments[arguments.length-1]+': '+arguments[arguments.length-3]
}

//assertNotEquals([комментарий], значение1, значение2) 	ошибка, если значения совпадают 
function assertNotEquals () {
	if(arguments[arguments.length-2]==arguments[arguments.length-1]) 
		throw arguments[arguments.length-2]+'=='+arguments[arguments.length-1]+': '+arguments[arguments.length-3]
}

//assertIdentity([комментарий], ожидаемое_значение, полученное_значение) 	ошибка, если полученное значение не тождественно с ожидавшимся 
function assertIdentity () {
	if(arguments[arguments.length-2]!==arguments[arguments.length-1])
		throw arguments[arguments.length-2]+'!=='+arguments[arguments.length-1]+': '+arguments[arguments.length-3]
}

//assertNotIdentity([комментарий], значение1, значение2) 	ошибка, если значения тождественны
function assertNotIdentity () {
	if(arguments[arguments.length-2]===arguments[arguments.length-1])
		throw arguments[arguments.length-2]+'==='+arguments[arguments.length-1]+': '+arguments[arguments.length-3]
}

//assertNull([комментарий], значение) 	ошибка, если значение не null
function assertNull () {
	if(arguments[arguments.length-1]!==null) throw arguments[arguments.length-2]
}

//assertNotNull([комментарий], значение) 	ошибка, если значение - null 
function assertNotNull () {
	if(arguments[arguments.length-1]===null) throw arguments[arguments.length-2]
}

//assertUndefined([комментарий], значение) 	ошибка, если значение не undefined 
function assertUndefined () {
	if(arguments[arguments.length-1]!==undefined) throw arguments[arguments.length-2]
}

//assertNotUndefined([комментарий], значение) 	ошибка, если значение - undefined: assertNotUndefined(undefined) 
function assertNotUndefined (arg1, arg2) {
	if(arguments[arguments.length-1]===undefined) throw arguments[arguments.length-2]
}

//assertNaN([комментарий], значение) 	ошибка, если значение не NaN 
function assertNaN () {
	if(arguments[arguments.length-1]!==NaN) throw arguments[arguments.length-2]
}

//assertNotNaN([комментарий], значение) 	ошибка, если значение - NaN: assertNotNaN(Number.NaN) 
function assertNotNaN () {
	if(arguments[arguments.length-1]===NaN) throw arguments[arguments.length-2]
}

//assertException([комментарий], код)	ошибка, если в коде не происходит исключения. Код - функция или текст
function assertException () {
	try{ 
		if( typeof(arguments[arguments.length-1]) == "function" ) arguments[arguments.length-1]() 
		else eval(arguments[arguments.length-1])
	}catch(e){return}

	throw arguments[arguments.length-2]
}

//assertNotException([комментарий], код)	ошибка, если в коде происходит исключение
function assertNotException () {
	try{ 
		if( typeof(arguments[arguments.length-1]) == "function" ) arguments[arguments.length-1]() 
		else eval(arguments[arguments.length-1])
	}catch(e){throw arguments[arguments.length-2]}
}

//fail(комментарий)	ошибка 
function fail (comment) {
	throw comment
}

function toQuotString(s) {
	s = s.replace(/(["\\])/g, '\\$1')
	s = s.replace(/\r/g, '\\r')
	s = s.replace(/\n/g, '\\n')
	s = s.replace(/\t/g, '\\t')
	return s
}

function toHTMLString(msg) {
	msg = '' + msg
	msg = msg.replace(/&/g, "&amp;")
	msg = msg.replace(/</g, "&lt;")
	msg = msg.replace(/>/g, "&gt;")
	msg = msg.replace(/"/g, "&quot;")
	msg = msg.replace(/'/g, "&#39;")
	return msg
}

function repr(val) {
	var i, s = '', a = []
	if(typeof val == "object") {
		if(val.valueOf() == "[object Object]" && val.length===undefined) {
			for(i in val) a.push(i+': '+repr(val[i]))
			return '{'+a.join(', ')+'}'
		}
		if(val.length) {
			for(i=0; i<val.length; i++) a.push(repr(val[i]))
			return '['+a.join(', ')+']'
		}
		return val
	}
	if(typeof val == "string") return '"'+toQuotString(val)+'"'
	if(val.valueOf) return val.valueOf()
	return ''+val
}

//warn(сообщение, [значение])	Пишет в лог красным цветом сообщение. Если указано значение, то выводит его как "сообщение: значение" 
function warn (msg, val, color) {
	if(val!==undefined)  msg += ": "+repr(val)
	if(color===undefined) color = "#ff0000"
	msg = toHTMLString(msg)
    parent.log(msg, color)
}

//inform(сообщение, [значение])	Пишет в лог зелёным цветом 
function inform (msg, val) {
	warn(msg, val, "green")
}

//info(сообщение, [значение])	Пишет в лог зелёным цветом 
function info (msg, val) {
	warn(msg, val, "green")
}

//debug(сообщение, [значение])	Пишет в лог синим цветом
function debug(msg, val) {
	warn(msg, val, "blue")
}
