
function tostring(s) {
    s = s.slice(1, s.length-1)
    return s.replace(/\\(["'])/, function(a, b){return b})
}

function js_quot(s) {
	s = s.replace(/(['"\\])/g, '\\$1')
	s = s.replace(/\r/g, '\\r')
	s = s.replace(/\n/g, '\\n')
	return s
}

function log(text, color, id) {
	var log = document.getElementById("LOG")
	var div = document.createElement("div")
    if(id) {
        div.id = id
        text = "<a name='"+id+"'></a>" + text
    }
    if(color) div.style.color = color
	div.innerHTML = text
	log.appendChild(div)
}

function tolog(id, bgcolor) {
try{
    if(!bgcolor) bgcolor = '#dedeff'
    var div = document.getElementById(id)
    do { 
        div.style.backgroundColor = bgcolor
        div = div.nextSibling
    } while(div && div.id=='');
    location.hash = '#'+id
}catch(e){alert('tolog: '+id+' '+e+' '+e.message)}
}

function clrlog(id) {
try{
    var div = document.getElementById(id)
    do {
        div.style.backgroundColor = 'white' 
        div = div.nextSibling
    } while(div && div.id=='');
}catch(e){alert('clrlog: '+id+' '+e+' '+e.message)}
}

// прогресс-бар
function progressBar(border, width, height) {
    this.width = width
    this.height = height
    document.writeln("<table id=progressBar style='border:"+border+";width:"+width+"px;height:"+height+"px'><tr></table>")
    this.table = document.getElementById('progressBar')
    this.table.id = ''
    this.row = this.table.rows[0]
    this.clean()
}

progressBar.prototype.clean = function() {
    var i, count = this.row.cells.length
    for(i=count-1; i>=0; i--) this.row.deleteCell(i)
    var cell = this.row.insertCell(0)
    cell.style.height = this.height + 'px'
}

progressBar.prototype.init = function(count) {
    this.count = count
    this.clean()
    this.width_item = parseInt(this.width) / count
    this.width_last_item = this.width_item + this.width % count
}

progressBar.prototype.step = function(color, name) {
    var width, cell
    if(this.count == this.row.cells.length) {
        cell = this.row.cells[this.row.cells.length-1]
        cell.style.width = this.width_last_item
    } else {
        cell = this.row.insertCell(this.row.cells.length-1)
        cell.style.width = this.width_item
    }
    //cell.style.clip = 'rect(0 '+this.width+'px '+this.height+'px 0)'
    //cell.style.overflow = 'hidden'
    cell.style.height = this.height + 'px'
    cell.style.backgroundColor = color
    cell.style.cursor = 'pointer'
    //cell.title = name
    cell.onmouseover = function() { tolog(name) }
    cell.onmouseout = function() { clrlog(name) }
    //cell.innerHTML = '&nbsp;'
}

function getXMLHttp() {
    if(window.ActiveXObject) {
        var version = ["MSXML2.XMLHttp.5.0", "MSXML2.XMLHttp.4.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp", "Microsoft.XMLHttp"]
        for (var i = 0; i < version.length; i++)
            try {	return new ActiveXObject(version[i])	} catch (e) {}
    }
    
   	try {
		return new XMLHttpRequest()
	} catch(e){}

	alert($T("Этот браузер не поддерживает технологию Ajax"))
}

function send(url, index, fn, errfn) {
	var q = getXMLHttp()
	if(!q) return
	q.onreadystatechange = function() {
		try{
			if (q.readyState == 4) { //statusElem.innerHTML = q.statusText // показать статус (Not Found, ОК..)
				if(q.status == 200 || q.statusText=='') { // q.statusText=='' - для протоколов file или ftp
                    try{
                        fn(index, q.responseText)
                    }catch(e){alert('send fn: '+fn+' '+e+' '+e.message)}
				} else { // тут можно добавить else с обработкой ошибок запроса
                    try{
                        if(errfn) errfn(index, q)
                    }catch(e){alert('send errfn: '+errfn+' '+e+' '+e.message)}
				}
			} else {
				//alert(q.readyState)
			}
		}catch(e){alert('send: '+e+' '+e.message)}
	}
    q.open('GET', url+"?"+Math.random(), true) // Чтобы тесты не кэшировались
	//q.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
    q.send(null)
}

var stopping   // прервать тесты

function stop() {
	stopping = true
}

var paths      // пути к тестам
var TestFiles  // массив с загруженными файлами
var numberTest // количество загруженных тестов
var countRun = 0 // сколько файлов загрузилось
var progress   // прогресс-бар
var count_tests // количество тестов
var jsframe // фрейм где будет выполнятся javascript-код теста

// запрашивает тесты
function run() {
	try{
		stopping = false
		document.getElementById('button').disabled=true
		document.getElementById("LOG").innerHTML = ''
        progress.clean()
		var test_index = document.getElementById('test_select').value
		paths = Tests[test_index][1]
		TestFiles = new Array(paths.length)
		numberTest = 0
        count_tests = 0
		var i
		for(i=0; i<paths.length; i++) {
			var url = window.location.protocol+"//"+window.location.host+window.location.pathname.replace(/\/[^\/]*$/, "")+"/"+paths[i]
            // запрашиваем файл
			send(url, i, function(index, code){ // а тут получаем
				TestFiles[index] = code
				if(document.getElementById("ch_loading").checked) 
					log('<span>'+$T('Загружен') +'</span> '+ paths[index])
                count_tests += code.match(/\bfunction\s+test\w+/g).length
				numberTest++
			}, 
            function(index, q) {
                var test_name = paths[index]
                paths = []
                numberTest = 0
                alert($T("Тест")+" \""+test_name+"\" "+$T("не получен. Ответ сервера: ")+q.statusText+" "+q.status)
                document.getElementById('button').disabled=false
            })
		}

        countRun = 0
		waitLoading()
	}catch(e){alert('run: '+e+' '+e.message)}
}

// ожидает загрузки всех тестов
function waitLoading() {
	try{
		if(document.getElementById("ch_timer").checked) 
			log((++countRun * 500/1000).toFixed(1) + ') <span>'+$T('загружено')+'</span> '+numberTest + ' <span>'+$T('из')+'</span> ' + paths.length)

		if(stopping) numberTest = paths.length
		
		if(numberTest!=paths.length) { // не все загрузились
			setTimeout(waitLoading, 500)
			return
		}

        // инициализируем 
		if(document.getElementById("ch_loading").checked) log('&nbsp;') // пустая строка
       
        var runs = document.getElementById('runs')
		var noerrors = document.getElementById('noerrors')
		var errors = document.getElementById('errors')
		runs.innerHTML = 0
		noerrors.innerHTML = 0
		errors.innerHTML = 0

        progress.init(count_tests)
        jsframe = window.frames["frame_for_js"] // фрейм где будет выполнятся javascript-код теста
        
        countRun = 0 // обнуляем счётчик для последующих вызовов
        Run() // запускаем тесты
        
    }catch(e){alert('waitLoading: '+e+' '+e.message)}
}


var opens = [], imports = [], open_vars = {}, frame_vars = {}, count_import = 0, import_urls = []
var code // код
var test_path // путь теста
var count_runs = 500 // сколько раз ожидать загрузку импортов, окон и фреймов
var interval = 10 // через сколько милисекунд проверять загрузки импортов, окон и фреймов
var counter_runs // счётчик

// запускает тест по одному
function Run() {
    try{
		if(stopping) countRun = TestFiles.length
        // все тесты выполнены
        if(countRun==TestFiles.length){
            document.getElementById('button').disabled = false
            return
        }    
        // загружаем в фрейм новую страницу
        var url = window.location.protocol+"//"+window.location.host+window.location.pathname.replace(/\/[^\/]*$/, "") + '/run.html'
        jsframe.location = url
        
        Run2()
    }catch(e){alert('Run: '+e+' '+e.message)}
}

function Run2() {
    try{
        //if(!jsframe.document || jsframe.document.readyState != 'complete') { setTimeout(Run2, 10); return } // ждём пока загрузится страница
		if(stopping) { Run(); return; }
		
        if(!jsframe.load_complete){ setTimeout(Run2, 0); return }

        test_path = paths[countRun]
        code = TestFiles[countRun++]        
        code = code.replace(/\/\*(.|\s)*?\*\/|\/\/.*/g, '') // сносим комменты
        
        // открыть окна
        code = code.replace(/\bopen\s+([A-Za-z_][\w]*)\s+("(?:[^"]|\\")*"|'(?:[^']|\\')*')\s+("([^"]|\\")*"|'([^']|\\')*')?/g, 
			function(s, name, url, options){
				var w
				url = tostring(url)
				if(options!==undefined) { w = open(url, '', tostring(options)) } else { w = open(url) }
				opens.push(w)
				open_vars[name] = w
				return ""
			}
		)
        
        // создать iframes
        code = code.replace(/\bframe\s+([A-Za-z_][\w]*)\s+("(?:[^"]|\\")*"|'(?:[^']|\\')*')/g, function(s, name, url){
            var frame = document.createElement("iframe")
            frame.name = name
            jsframe.document.body.appendChild(frame)
            frame.src = tostring(url)
            var w = jsframe.frames[name]
            frame_vars[name] = w
            return ""
        })

        // запросить импорты
        count_import = 0
        import_urls = []
        imports = []
        code = code.replace(/\bimport\s+("(?:[^"]|\\")*"|'(?:[^']|\\')*')/g, function(s, url){
            url = tostring(url)
            send(url, import_urls.length, function(index, code) {
                if(code == '') log('import no loaded', 'red')
                imports[index] = code
                count_import++
            }, 
            function(index, q){
                log('import no loaded', 'red')
            })
            import_urls.push(url)
            return ""
        })
        
        counter_runs = 0
        Run3()

    }catch(e){alert('Run2: '+e+' '+e.message)}
}

function Run3() {
    try{
		if(stopping) { Run(); return; }
		
        if(counter_runs++ < count_runs) {
            // проверяем: все ли фреймы, окна и js-модули загрузились
            var i
            
            if(count_import!=import_urls.length) { setTimeout(Run3, interval); return }
            for(i in frame_vars) if(!frame_vars[i].document || frame_vars[i].document.readyState != 'complete') { setTimeout(Run3, interval); return }
            for(i=0; i<opens.length; i++) if(!opens[i].document || opens[i].document.readyState != 'complete') { setTimeout(Run3, interval); return }
        }
        
        // загрузились все

        for(i in open_vars) jsframe[i] = open_vars[i]
        
        var runs = document.getElementById('runs')
		var noerrors = document.getElementById('noerrors')
		var errors = document.getElementById('errors')
        
        try {
            for(i=0; i<imports.length; i++) jsframe.eval(imports[i]) // подключили импорты
        }catch(e){
            log("<span>"+$T("Ошибка в файле импорта")+"</span> "+import_urls[i]+": "+e+' '+e.message)
            return
        }
        
   		var test = code.match(/\bfunction\s+test\w+/g)

		for(i=0; i<test.length; i++) {
			test[i] = test[i].replace(/^function\s+/, '')
		}
  
        try {
            jsframe.eval(code)
        } catch(e) {
            log(js_quot(test_path+': '+e+' '+e.message), 'red')
            errors.innerHTML = 1 + parseInt(errors.innerHTML)
            return
        }

        if(code.search(/\bfunction\s+setUp\b/)==-1) jsframe.setUp = function(){}
        if(code.search(/\bfunction\s+tearDown\b/)==-1) jsframe.tearDown = function(){}

        var i
        for(i=0; i<test.length; i++) {
            if(stopping) break
			
            var test_name = test[i]
            //test_path = test_path.replace(/\.js$/, "").replace(/\W/g, '_').replace(/^\d/, '_$1')
            test_path = test_path.replace(/js$/, "").replace(/\//g, ".")
            var test_id = test_path + test_name //+ ' \t<br>'
            var ch_tests = document.getElementById("ch_tests").checked
            log((ch_tests? test_id+':':''), '', test_id)
            var bgcolor
            
            try{
                jsframe.setUp()
                jsframe.eval(test_name+"()")
                jsframe.tearDown()
                bgcolor = "#00ff00"
                noerrors.innerHTML = 1 + parseInt(noerrors.innerHTML)
            }catch(e){
                log(test_name+': '+e+(e.message? ' '+e.message: ''), 'red')
                bgcolor = "red"
                errors.innerHTML = 1 + parseInt(errors.innerHTML)                
            }
            
            runs.innerHTML = 1 + parseInt(runs.innerHTML)
            progress.step(bgcolor, test_id)
            
        }	

        for(i=0; i<opens.length; i++) opens[i].close() // закрываем все окна
        jsframe.location = 'about:blank'               // и фреймы
        
        // Run()
        setTimeout(Run, 0) // не люблю рекурсию
        
	}catch(e){alert('Run3: '+e+' '+e.message)}
}

