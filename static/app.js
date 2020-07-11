function initializeApp() {
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState != 4) return;

        let data = JSON.parse(this.responseText);
		if (this.status == 401) {
            alert(data.message)
            window.location.href = `${location.protocol}//${location.host}/`;
		} else if (this.status == 200) {
            init()
		}
		console.log(data)
	};
	xhr.open("GET", "/login", true);
	xhr.send();
    
    document.querySelector(".logOut").onclick = function() {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState != 4) return;
    
            let data = JSON.parse(this.responseText);
            if (this.status == 200) {
                alert(data.message)
                window.location.href = `${location.protocol}//${location.host}/`;
            }
        };
        xhr.open("PUT", "/login", true);
        xhr.send();
    }
}

function init() {
    document.querySelector(".files").innerHTML = ""

    let a = document.createElement("a")
    let svg = document.querySelector(".logo").cloneNode(true)
    a.append(svg)
    let p = document.createElement("p")
    p.innerHTML = "NEW"
    a.append(p)
    document.querySelector(".files").append(a)

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState != 4) return;

        if (this.status == 200) {
            let data = JSON.parse(this.responseText)
            console.log(data)
            data.forEach(elem => {
                a = document.createElement("a")
                a.classList.add("file")
                svg = document.querySelector(".logo").cloneNode(true)
                a.append(svg)
                p = document.createElement("p")
                p.innerHTML = elem
                a.append(p)
                document.querySelector(".files").append(a)
            });

            addListeners()
        } else if(this.status == 401) {
            console.log(this.responseText)
            let data = JSON.parse(this.responseText)
            alert(data.message)
            window.location.href = `${location.protocol}//${location.host}/`;
        }
    };
    xhr.open("GET", "/files", true);
    xhr.send();

    const queryParameters = ( params ) => {
        let href = location.href;
        let reg = new RegExp( '[?&]' + params + '=([^&#]*)', 'i' );
        let queryString = reg.exec(href);
        return queryString ? queryString[1] : null;
    };

    if(queryParameters('welcome')=='true') {
        document.querySelector(".welcome").classList.remove("hidden")
    }
}

function refreshFilesList() {
    document.querySelector(".files").innerHTML = ""

    let a = document.createElement("a")
    let svg = document.querySelector(".logo").cloneNode(true)
    a.append(svg)
    let p = document.createElement("p")
    p.innerHTML = "NEW"
    a.append(p)
    document.querySelector(".files").append(a)

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState != 4) return;

        if (this.status == 200) {
            let data = JSON.parse(this.responseText)
            console.log(data)
            data.forEach(elem => {
                a = document.createElement("a")
                a.classList.add("file")
                svg = document.querySelector(".logo").cloneNode(true)
                a.append(svg)
                p = document.createElement("p")
                p.innerHTML = elem
                a.append(p)
                document.querySelector(".files").append(a)
            });
            document.querySelectorAll(".file").forEach(file => {
                a.onclick = function() {
                    document.querySelectorAll(".file").forEach(check => {
                        if(check!=a) check.classList.remove("active")
                    })
                    if(a.classList.contains("active")) {
                        document.querySelector(".filesDiv").classList.remove("options")
                        a.classList.remove("active")
                    } else {
                        activeFile = a.lastElementChild.innerHTML
                        activeFileElem = a.lastElementChild
                        document.querySelector(".filesDiv").classList.add("options")
                        a.classList.add("active")
                    }
                }
            })
        } else if(this.status == 401) {
            console.log(this.responseText)
            let data = JSON.parse(this.responseText)
            alert(data.message)
            window.location.href = `${location.protocol}//${location.host}/`;
        }
    };
    xhr.open("GET", "/files", true);
    xhr.send();
}

let activeFile = "", activeFileElem

function addListeners() {
    setTimeout(() => {
        document.querySelector(".welcome a.close").onclick = function(){
            this.parentElement.classList.add("hidden")
            window.history.pushState({},"","?")
        }
    }, 100);

    document.querySelector(".logoDiv").onclick = function() {
        document.querySelector(".welcome").classList.remove("hidden")
        window.history.pushState({},"","?welcome=true")
    }

    document.querySelector(".files a").onclick = function() {
        document.querySelector(".fileEditor").classList.add("opened")
        document.querySelector("input[name=fileName]").focus()
        document.querySelectorAll(".file").forEach(check => {
            check.classList.remove("active")
        })
        document.querySelector(".filesDiv").classList.remove("options")
        document.querySelector("textarea").value = ""
        document.querySelector("input[name=fileName]").readOnly = false
        setTimeout(() => {
            document.querySelector("input[name=fileName]").value = ""
        }, 10);
    }

    document.querySelectorAll(".file").forEach(file => {
        file.onclick = function() {
            document.querySelectorAll(".file").forEach(check => {
                if(check!=file) check.classList.remove("active")
            })
            if(file.classList.contains("active")) {
                document.querySelector(".filesDiv").classList.remove("options")
                file.classList.remove("active")
            } else {
                activeFile = file.lastElementChild.innerHTML
                activeFileElem = file.lastElementChild
                document.querySelector(".filesDiv").classList.add("options")
                file.classList.add("active")
            }
        }
    })

    document.querySelectorAll(".close").forEach(close => {
        close.onclick = function(e) {
            e.preventDefault()
            close.parentElement.parentElement.classList.remove("opened")
            document.querySelector("input[name=fileName]").readOnly = false
            document.querySelector("input[name=fileName]").value = ""
            document.querySelector("input[name=fileName2]").value = ""
            document.querySelector("textarea").value = ""
        }
    })

    document.querySelector(".openDiv").onclick = function() {
        openFile(activeFile)
    }

    document.querySelector("input[name=saveFileBtn]").onclick = function(e) {
        e.preventDefault()
        saveFile(document.querySelector("input[name=saveFileBtn]").parentElement)
    }

    document.querySelector(".renameDiv").onclick = function() {
        document.querySelector(".fileRename").classList.add("opened")
        document.querySelector("input[name=fileName1]").value = activeFile
    }

    document.querySelector("input[name=renameFileBtn]").onclick = function(e) {
        e.preventDefault()
        renameFile(activeFile, document.querySelector("input[name=fileName2]").value)
    }

    document.querySelector(".deleteDiv").onclick = function() {
        document.querySelector("#activeFile").innerHTML = activeFile
        document.querySelector("input[name=fileName3]").value = activeFile
        document.querySelector(".fileDelete").classList.add("opened")
    }

    document.querySelector("input[name=deleteFileBtn]").onclick = function(e) {
        e.preventDefault()
        deleteFile(activeFile)
    }

    document.querySelector(".detailsDiv").onclick = function() {
        document.querySelector(".fileDetails").classList.add("opened")
        fileDetails(activeFile)
    }

    document.onkeydown = function(evt) {
        evt = evt || window.event;
        if (evt.keyCode == 27) {
            if(!document.querySelector(".welcome").classList.contains("hidden")) {
                document.querySelector(".welcome").classList.add("hidden")
                window.history.pushState({},"","?")
            } else {
                let flag = false
                document.querySelectorAll("section").forEach(section=> {
                    if(section.classList.contains("opened")) {
                        flag = true
                        section.classList.remove("opened")
                    }
                })
                if(!flag &&  document.querySelector(".filesDiv").classList.contains("options")) {
                    document.querySelectorAll(".file").forEach(check => {
                        check.classList.remove("active")
                    })
                    document.querySelector(".filesDiv").classList.remove("options")
                }
            }
        }

        // Delete File
        if (evt.keyCode == 72 && evt.altKey) {
            document.querySelector(".logoDiv").click();
        }

        if(document.querySelector(".welcome").classList.contains("hidden")) {
            if(document.querySelector(".fileEditor").classList.contains("opened")) {
                // Save File
                if (evt.keyCode == 83 && evt.altKey)
                    document.querySelector("input[name='saveFileBtn']").click()
            } else if(document.querySelector(".filesDiv").classList.contains("options")) {
                // Delete File
                if (evt.keyCode == 46 && evt.altKey) {
                    document.querySelector(".deleteDiv").click();
                }

                // File Info
                if (evt.keyCode == 73 && evt.altKey) {
                    document.querySelector(".detailsDiv").click();
                }

                // Open File
                if (evt.keyCode == 79 && evt.altKey) {
                    document.querySelector(".openDiv").click();
                }

                // Rename File
                if (evt.keyCode == 82 && evt.altKey) {
                    document.querySelector(".renameDiv").click();
                }

                // New File
                if (evt.keyCode == 78 && evt.altKey) {
                    document.querySelector(".files a").click();
                }
            } else {
                // New File
                if (evt.keyCode == 78 && evt.altKey) {
                    document.querySelector(".files a").click();
                }
            }
        }
    }
}

function openFile(file) {
    let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState != 4) return;

		if (this.status == 200) {
            document.querySelector(".fileEditor").classList.add("opened")
            document.querySelector("input[name=fileName]").value = activeFile
            document.querySelector("input[name=fileName]").readOnly = true
            document.querySelector("textarea").value = this.responseText
            document.querySelector("textarea").focus()
			console.log("Opened "+file+"!")
		} else if(this.status == 404) {
            activeFileElem.parentElement.remove()
			alert(JSON.parse(this.responseText).message)
        } else if (this.status == 401) {
            alert(JSON.parse(this.responseText).message)
            window.location.href = `${location.protocol}//${location.host}/`;
        }
	};
	xhr.open("PUT", "/files", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('x-action', 'open');
	xhr.send(JSON.stringify({
		fileName: file
    }));

    return false;
}

function saveFile(form) {
    let fileName = "",
        fileCont = ""
    Array.prototype.slice.call(document.querySelector(".fileEditor form").elements).forEach( (elem)=> {
        if(elem.name=="fileName")
            fileName = elem.value
        if(elem.name=="fileCont")
            fileCont = elem.value
    })

    let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState != 4) return;

        document.querySelector(".fileEditor").classList.remove("opened")
        document.querySelector("input[name=fileName]").readOnly = false
        document.querySelector("input[name=fileName]").value = ""
        document.querySelector("textarea").value = ""
		if (this.status == 200 || this.status == 201) {
            console.log(this.responseText)
            if (this.status == 201) {
                let a = document.createElement("a")
                a.classList.add("file")
                let svg = document.querySelector(".logo").cloneNode(true)
                a.append(svg)
                let p = document.createElement("p")
                p.innerHTML = fileName
                a.append(p)
                document.querySelector(".files").append(a)
                document.querySelectorAll(".file").forEach(file => {
                    a.onclick = function() {
                        document.querySelectorAll(".file").forEach(check => {
                            if(check!=a) check.classList.remove("active")
                        })
                        if(a.classList.contains("active")) {
                            document.querySelector(".filesDiv").classList.remove("options")
                            a.classList.remove("active")
                        } else {
                            activeFile = a.lastElementChild.innerHTML
                            activeFileElem = a.lastElementChild
                            document.querySelector(".filesDiv").classList.add("options")
                            a.classList.add("active")
                        }
                    }
                })
            }
		} else if (this.status == 401) {
            alert(this.responseText)
            window.location.href = `${location.protocol}//${location.host}/`;
        }
	};
	xhr.open("POST", "/files", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({
		fileName: fileName,
		fileCont: fileCont
	}));

    return false;
}

function renameFile(frm, to) {
    let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState != 4) return;

        let data = JSON.parse(this.responseText);
        if(this.status == 200) {
            document.querySelector(".fileRename").classList.remove("opened")
            document.querySelector("input[name=fileName2]").value = ""
            activeFileElem.innerHTML = to
        } else if(this.status == 400 || this.status == 403 || this.status == 404) {
            if(this.status == 404) {
                activeFileElem.parentElement.remove()
                document.querySelector(".fileRename").classList.remove("opened")
            }
            alert(data.message)
        } else if (this.status == 401) {
            alert(data.message)
            window.location.href = `${location.protocol}//${location.host}/`;
        }
	};
	xhr.open("PUT", "/files", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('x-action', 'rename');
	xhr.send(JSON.stringify({
        frm: frm,
        to : to
    }));

    return false;
}

function deleteFile(file) {
    let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState != 4) return;

        if (this.status == 200) {
            activeFileElem.parentElement.remove()
            document.querySelector(".fileDelete").classList.remove("opened")
            document.querySelector(".filesDiv").classList.remove("options")
        } else if (this.status == 400 || this.status == 404) {
            activeFileElem.parentElement.remove()
            document.querySelector(".fileDelete").classList.remove("opened")
            document.querySelector(".filesDiv").classList.remove("options")
            alert(this.responseText)
        } else if (this.status == 401) {
            alert(this.responseText)
            window.location.href = `${location.protocol}//${location.host}/`;
        }
	};
	xhr.open("DELETE", "/files", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({
		fileName: file
    }));

    return false;
}

function fileDetails(file) {
    let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState != 4) return;

        let data = JSON.parse(this.responseText);
		if (this.status == 401) {
            alert(data.message)
            window.location.href = `${location.protocol}//${location.host}/`;
		} else if (this.status == 200) {
            activeFileElem.parentElement.classList.remove("active")
            document.querySelector(".filesDiv").classList.remove("options")

            document.querySelector("#fileDetailsName").innerHTML = file
            document.querySelector("#fileDetailsSize").innerHTML = data.size + " bytes"
            document.querySelector("#fileDetailsCreated").innerHTML = formatDate(data.birthtime)
            document.querySelector("#fileDetailsAccessed").innerHTML = formatDate(data.atime)
            document.querySelector("#fileDetailsModified").innerHTML = formatDate(data.ctime)
		} else {
            if(this.status == 404) {
                alert("No such file exists!")
            } else {
                alert("An unknown error occurred!")
            }
            refreshFilesList()
            document.querySelector(".filesDiv").classList.remove("options")
        }
	};
	xhr.open("PUT", "/files", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('x-action', 'details');
	xhr.send(JSON.stringify({
		fileName: file
    }));

    return false;
}

function formatDate(date) {
    date = new Date(date)
    var options = { weekday: 'short', year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Intl.DateTimeFormat('en-IN', options).format(date)
}
