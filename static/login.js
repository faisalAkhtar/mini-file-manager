function initializeApp() {
	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState != 4) return;

		let data = JSON.parse(this.responseText);
		if (this.status == 200) {
			alert(data.message)
			window.location.href = `${location.protocol}//${location.host}/app`;
		}
		console.log(data)
	};
	xhr.open("GET", "/login", true);
	xhr.send();
}

function formHandler(form) {
	let x = serializeObj(form)
	console.log("x")

	let xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function () {
		if (this.readyState != 4) return;

		if (this.status == 200) {
			let data = JSON.parse(this.responseText);
			if(data.status==1) {
				alert(data.message)
				window.location.href = `${location.protocol}//${location.host}/app?welcome=true`;
			} else {
				alert(data.message)
			}

			console.log(data)
		}
	};
	xhr.open("POST", "/login", true);
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.send(JSON.stringify({
		username: x.username,
		password: x.password
	}));

	return false;
}

var serializeObj = function (form) {
	let obj = {};
	Array.prototype.slice.call(form.elements).forEach(function (field) {
		if (!field.name || field.disabled || ['file', 'reset', 'submit', 'button'].indexOf(field.type) > -1) return;
		if (field.type === 'select-multiple') {
			Array.prototype.slice.call(field.options).forEach(function (option) {
				if (!option.selected) return;
				obj[field.name] = option.value;
			});
			return;
		}
		if (['checkbox', 'radio'].indexOf(field.type) >-1 && !field.checked) return;
		obj[field.name] = field.value;
	});
	return obj;
};
