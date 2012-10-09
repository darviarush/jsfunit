// Библиотека для манипуляций с браузером. Эмулирует нажатия пользователя

// устанавливает all у окна win. После чего к элементу с id или name можно обращатся как win.name_element
function init_window(win) {
	var tags = win.document.getElementsByTagName('*')
	win.all = {}
	for(i=0; i<tags.length; i++) {
		var tag = tags.item(i)
		if(tag.id) {
			win.all[tag.id] = tag
		}
	}
}

// если cond не станет true за time микросекунд - выход
// cond работает только с глобальными переменными, если задан строкой. Для локальных переменных используйте функцию:
// var a = 10, b = 10
// waitCondition(function(){ return a == b }, 500)
function waitCondition (cond, time) {
	var endTime = new Date().getTime() + time;

	while (new Date().getTime() < endTime) {
	var res = (typeof(cond)=='string'? eval(cond): cond())
	if( res ) return true
	}
	return false
}

// спать time микросекунд
function sleep (time) {
	waitCondition("false", time)
}

// Ожидает загрузки окна win
function waitLoadWindowDef (win, time) {
	return waitCondition(function(){
		return win.document.readyState == 'complete'
	}, time)
}

function waitLoadWindow (win, time) {
	assert("waitLoadWindow: Окно `"+win.name+"' не успело загрузиться за "+time+" микросекунд", waitLoadWindowDef(win, time))
}

// Возвращает окно по его имени
// time - сколько ждать полной загрузки. 5000 по умолчанию
function getWindowDef (name, time) {
	if(!time) time = 5000
	name = translit(name)
	var count = 3
	time /= count
	var i, win
	for(i=0; i<count; i++) { // Пытаемся count раз обнаружить окно
	win = window.open("", name)
	waitLoadWindowDef(win, time)
	if(win.location != "about:blank") break  // окно обнаружено
	win.close()
	}
	
	if(win.location == "about:blank")	return undefined  // окно не обнаружено
	
	return win
}

// Если окно не загрузилось - бросает эксепшн
function getWindow (name, time) {
	if(!time) time = 5000
	var win = getWindowDef(name, time)
	if(!win) fail("getWindow: Не удалось дождаться загрузки окна `"+name+"' за "+time+" микросекунд")
	return win
}

// Ждёт загрузки страницы в указанный фрейм и возвращает его объект
function getFrameWindowDef (win, frame, time) {
	if(time == undefined) time = 5000
	var count = 3
	time /= count
	var i
	for(i=0; i<count; i++) {
		try {
			var frame_win = win.frames[frame]
			if( waitLoadWindowDef(frame_win, time) ) return frame_win
		} catch(e) { sleep(time) } // Пропускаем ошибки "Разрешение отклонено" и "document есть null или не является объектом"
	}
	return undefined
}

function getFrameWindow (win, frame, time) {
	var win = getFrameWindowDef(win, frame, time)
	if( win ) return win
	fail("getFrameWindow: Не удалось дождаться загрузки страницы в фрейм `"+frame+"'")
}


// Выбирает опцию тега <select> с текстом text
function selectDef (sel, text, number) {
	if(!number) number = 1
	for(var i = 0; i < sel.length; i++) {
		if(sel.options[i].text==text && !--number) {
			sel.selectedIndex = i
			return true
		}
	}
	return false
}

function select (sel, text, number) {
	assert("select: Не могу выбрать опцию `"+text+"'", selectDef(sel, text, number))
}

// возвращет ссылку на элемент с текстом text_in_link: <div>text_in_link</div>
// event представляет собой строку кода
// event можно устанавливать в link.innerText, link.innerHTML, link.value, link.options[link.selectedIndex].text, link.title и т.п.
function linkDef(win, text_in_link, tag, event, number) {
	if(!event) event = document.body.innerText?"link.innerText": "link.innerHTML.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')"
	if(!number) number = 1

	var i
	var links = win.document.getElementsByTagName(tag? tag: "*");
	
	text_in_link = text_in_link.replace(/^\s+/, "")
	text_in_link = text_in_link.replace(/\s+$/, "")
	text_in_link = text_in_link.replace(/\s+/g, " ")
	
	for(i=0; i<links.length; i++) {
	var link = links.item(i)
	var text
	try { text = eval(event) } catch(e) {}
	
	text = text.replace(/^\s+/, "")
	text = text.replace(/\s+$/, "")
	text = text.replace(/\s+/g, " ")

	if(text == text_in_link) {
		if(number==1) return link
		number--
	}
	}
	return undefined // не удалось найти объект
}

function link(win, text_in_link, tag, event, number) {
	var res = linkDef(win, text_in_link, tag, event, number)
	if(!res) fail("link: Не найден элемент `"+text_in_link+"' "+tag+" "+event)
	return res
}

// нажимает на элемент указанный по контенту
function clickToLinkDef(win, text_in_link, number) {
	var a = linkDef(win, text_in_link, undefined, undefined, number)
	if(a) {
	a.click()
	return true
	}
	return false
}

function clickToLink(win, text_in_link, number) {
	assert("clickToLink: Не могу нажать на `"+text_in_link+"'", clickToLinkDef(win, text_in_link, number))
}

// нажимает на кнопку с названием text_in_value
function clickToButtonDef(win, text_in_value, number) {
	var a = linkDef(win, text_in_value, "input", "link.type=='button'? link.value: ''", number)
	if(!a) return false
	a.click()
	return true
}

function clickToButton(win, text_in_value, number) {
	assert("clickToButton: Не могу нажать на кнопку `"+text_in_value+"'", clickToButtonDef(win, text_in_value, number))
}

// нажимает на ссылку и возвращает указатель на открытое окно. Но имя окна должно совпадать с названием ссылки
function openLink(win, text_in_link, sleepTime, time, number) {
	assert("openLink: Не удалось открыть окно по нажатию на `"+text_in_link+"'", clickToLinkDef(win, text_in_link, number))
	if(sleepTime) sleep(sleepTime)
	var win = getWindowDef(text_in_link, time)
	if(!win) fail("openLink: Не удалось дождаться открытия окна по нажатию на `"+text_in_link+"'")
	return win
}

// нажимает на кнопку и возвращает указатель на открытое окно. Но имя окна должно совпадать с названием ссылки
function openButton(win, text_in_value, sleepTime, time, number) {
	assert("openButton: Не удалось открыть окно по нажатию на `"+text_in_value+"'", clickToButtonDef(win, text_in_value, number))
	if(sleepTime) sleep(sleepTime)
	var win = getWindowDef(text_in_value, time)
	if(!win) fail("openLink: Не удалось дождаться открытия окна по нажатию на `"+text_in_value+"'")
	return win
}

var translit_array = {
"А": "A",
"Б": "B",
"В": "V",
"Г": "G",
"Д": "D",
"Е": "E",
"Ё": "OH",
"Ж": "ZH",
"З": "Z",
"И": "I",
"Й": "J",
"К": "K",
"Л": "L",
"М": "M",
"Н": "N",
"О": "O",
"П": "P",
"Р": "R",
"С": "S",
"Т": "T",
"У": "U",
"Ф": "F",
"Х": "X",
"Ц": "C",
"Ч": "CH",
"Ш": "SH",
"Щ": "SCH",
"Ъ": "QH",
"Ы": "Y",
"Ь": "Q",
"Э": "EH",
"Ю": "W",
"Я": "AH"
}

// транслитерирует текст
function translit(s) {
    var i
    s = s.replace(/^\s+/, "")
    s = s.replace(/\s+$/, "")
    s = s.replace(/\s+/g, "_")
    s = s.replace(/[^A-Za-z_АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя0-9]/g, "_")
    s = s.replace(/[АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя]/g, function(c) {
        return translit_array[c.toUpperCase()]
    })
    return s
}

// устанавливает транслитерированный win.document.title win.name, если win.name пуст
function set_translit_name_window(win) {
	if(!win.name) {
		win.name = translit(win.document.title)
	}
}