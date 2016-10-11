// Locale + Key JavaScript classes
// Copyright (C) 2013 Bernhard Waldbrunner
/*
 *	This program is free software: you can redistribute it and/or modify
 *	it under the terms of the GNU General Public License as published by
 *	the Free Software Foundation, either version 3 of the License, or
 *	(at your option) any later version.
 *
 *	This program is distributed in the hope that it will be useful,
 *	but WITHOUT ANY WARRANTY; without even the implied warranty of
 *	MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *	GNU General Public License for more details.
 *
 *	You should have received a copy of the GNU General Public License
 *	along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

(function(ns) {
	"use strict";

	if (!ns.Locale)
	{
		var Locale = {
			get: function (attr) {
				return Locale[Locale.active][attr];
			},

			DE: {
				keyboard: "US",
				thousand: '.',
				decimal: ',',
				precision: 2,
				weekdays: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
				time: ':',
				empty: ''
			},
			EN: {
				keyboard: "US",
				thousand: ',',
				decimal: '.',
				precision: 2,
				weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
				time: ':',
				empty: ''
			},
			active: "DE"
		};

		var Key = {
			normal: {
				BACK: 8, TAB: 9, ENTER: 13, SHIFT: 16, CTRL: 17, ALT: 18, PAUSE: 19,
				CAPS: 20, LOCK: 20, ESC: 27, SPACE: 32, " ": 32, PGUP: 33, PGDOWN: 34,
				END: 35, HOME: 36, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, PLUS: 43,
				"BREAK": 19, SCREEN: 44, PRINT: 44, INS: 45, DEL: 46, NUM: 144,
				NUMLOCK: 144, SCROLL: 145, SCRLOCK: 145, POS1: 36, PGDN: 34, ESCAPE: 27,
				ZERO: 48, ONE: 49, TWO: 50, THREE: 51, FOUR: 52, FIVE: 53, SIX: 54,
				SEVEN: 55, EIGHT: 56, NINE: 57, "RETURN": 13, LF: 13, CR: 13,
				"=": 61, "*": 106, "+": 107, "-": 109, ".": 110, "/": 111,
				F1: 112, F2: 113, F3: 114, F4: 115, F5: 116, F6: 117, F7: 118, F8: 119,
				F9: 120, F10: 121, F11: 122, F12: 123,
				A: 65, B: 66, C: 67, D: 68, E: 69, F: 70, G: 71, H: 72, I: 73, J: 74,
				K: 75, L: 76, M: 77, N: 78, O: 79, P: 80, Q: 81, R: 82, S: 83, T: 84,
				U: 85, V: 86, W: 87, X: 88, Y: 89, Z: 90,
				"0": 96, "1": 97, "2": 98, "3": 99, "4": 100, "5": 101, "6": 102,
				"7": 103, "8": 104, "9": 105,
				";": 186, SEMI: 59, SEMICOLON: 59, EQ: 187, EQUAL: 187, ",": 188,
				MIN: 189, MINUS: 189, COMMA: 188, POINT: 190, DASH: 189,
				PERIOD: 190, DIV: 191, SLASH: 191, "`": 192, "[": 219, "\\": 220,
				"]": 221, "'": 222, APOS: 222
			},
			modified: {
				US: {
					"~": 192, ")": 48, "!": 49, "@": 50, "#": 51, "$": 52, "%": 53,
					"^": 54, "&": 55, "*": 56, "(": 57, "_": 109, "+": 61, "{": 219,
					"}": 221, "|": 220, ":": 59, "\"": 222, "<": 188, ">": 189,
					"?": 191, MUL: 56, ASTERISK: 56, AT: 50, HASH: 51, POUND: 51,
					DOLLAR: 51, AMP: 55, PERCENT: 53, TILDE: 192, EXC: 49, BANG: 49,
					QUEST: 191, WHY: 191, PLUS: 61, SCORE: 109, LT: 188, GT: 189,
					INS: 96, END: 97, DOWN: 98, PGDOWN: 99, PGDN: 99, LEFT: 100,
					RIGHT: 102, HOME: 103, UP: 104, PGUP: 105
				}
			},

			keyCode: function (ev) {
				if (ev && !ev.which && (ev.charCode || ev.keyCode))
					ev.which = ev.charCode || ev.keyCode;
				if (window.event && !event.which && (event.charCode || event.keyCode))
					event.which = event.charCode || event.keyCode;
				return (ev ? ev.which : event.which);
			},

			is: function (ev, ch, ignoreShift) {
				if (!ev)
					return null;
				if (!ch && ch !== 0)
					return !!ev.keyCode;
				else if (ch instanceof Array)
				{
					var c;
					for (c in ch)
						if (Key.is(ev, ch[c], ignoreShift))
							return true;
					return false;
				}
				var code = Key.keyCode(ev);
				ch = String(ch).toUpperCase();
				return (ev.shiftKey && !ignoreShift && code != 16 ?
						Key.modified[Locale.get('keyboard')][ch] == code :
						Key.normal[ch] == code);
			},

			isShift: function (ev, ch) {
				return ev && ev.shiftKey && Key.is(ev, ch, true);
			},

			character: function (k, shift) {
				if (typeof k == "object")
				{
					shift = !shift && k.shiftKey;  // ignoreShift
					k = Key.keyCode(k);
				}
				if (!k)
					return null;
				return Object.getKey((shift && k != 16 ?
					   Key.modified[Locale.get('keyboard')] :
					   Key.normal), k, "number") || String.fromCharCode(k);
			},

			isPrintable: function (ev) {
				if (!ev)
					return null;
				var k = Key.keyCode(ev);
				return (k > 31 && k < 127) || (k > 160 && k < 256 && k != 173);
			},

			isASCII: function (ev) {
				return Key.isPrintable(ev) && Key.keyCode(ev) < 127;
			}
		};

		Number.prototype.format = function (precision, decimal, thousand) {
			if (typeof decimal == "undefined")
				decimal = Locale.get("decimal");
			if (typeof thousand == "undefined")
				thousand = Locale.get("thousand");
			if (typeof precision == "undefined")
				precision = Locale.get("precision");
			var num = this.toFixed(precision).toString().split('.');
			num[0] = num[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
			return num.join(decimal);
		};

		var formatNumber = function(elem, value) {
			if (elem == null)
				return;
			var val;
			if (typeof value == "undefined")
				val = parseNumber(elem.value);
			else if (typeof value == "string")
				val = parseFloat(value);
			else if (typeof value == "number")
				val = value;
			if (isNaN(val))
			{
				if (formatNumber.allowNaN)
					val = 0;
				else
				{
					elem.value = (typeof value == "undefined" ?
									 Locale.get('empty') : value);
					return;
				}
			}
			elem.value = val.format();
		};

		formatNumber.allowNaN = false;

		var formatDay = function(elem, month, year) {
			if (elem == null || typeof month == "undefined" ||
				typeof year == "undefined")
				return;
			var d = parseInt(elem.value);
			var $el = $(elem).closest(formatDay.closest).find(formatDay.query);
			if (isNaN(d) || d < 1 || d > (new Date(year, month, 0)).getDate())
			{
				elem.value = "";
				$el.val("");
			}
			else
			{
				elem.value = d + ".";
				$el.val(Locale.get('weekdays')[new Date(year, month-1, d).getDay()]);
			}
		};

		formatDay.query = '';
		formatDay.closest = '';

		var formatTime = function(elem, round) {
			if (elem == null)
				return;
			var t = parseTime(elem.value);
			if (round)
				t = (formatTime.floorRegEx.test(elem.id) ?
				     Math.floor(t * formatTime.roundFactor) :
					 Math.ceil(t * formatTime.roundFactor)) / formatTime.roundFactor;
			elem.value = printTime(t);
		};

		formatTime.floorRegEx = /^$/;
		formatTime.roundFactor = 10;

		var timeDiff = function(elem1, elem2, absolute) {
			if (elem1 == null || elem2 == null)
				return;
			var t1 = (elem1 ? parseTime(elem1.value) : 0),
			    t2 = (elem2 ? parseTime(elem2.value) : 0);
			if (t2 < t1 && absolute)
				t2 += 24;
			return t2 - t1;
		};

		var printTime = function(t) {
			if (t == null)
				return "";
			if (typeof t == "object")
				t = t.value;
			var h = parseInt(t, 10);
			var m = Math.round((t - h)*60);
			if (isNaN(m) || m < 0)
				m = 0;
			if (isNaN(h) || h < 0)
				h = 0;
			if (h > 23)
				h = 23;
			return (h < 10 && printTime.zeros ? "0"+h : h) + Locale.get('time') +
				   (m < 10 && printTime.zeros ? "0"+m : m);
		};

		printTime.zeros = true;

		var parseTime = function(s) {
			if (s == null)
				return Locale.get('empty');
			if (typeof s == "object")
				s = s.value;
			s = s.split(Locale.get('time'));
			var h = parseInt(s[0], 10), m = parseInt(s[1], 10);
			if (isNaN(h) || h < 0)
				h = 0;
			if (h >= 100 && isNaN(m))
			{
				h = h.toString();
				if (h.length == 3)
					h = "0" + h;
				m = parseInt(h.substr(2), 10);
				h = parseInt(h.substr(0, 2), 10);
			}
			if (h > 23)
				h = 0;
			if (isNaN(m) || m < 0)
				m = 0;
			return h + m/60;
		};

		var parseNumber = function(s, decimal, thousand) {
			switch (typeof s)
			{
				case "undefined":
					return NaN;
				case "object":
					s = String(s.value);
					break;
				default:
					s = s.toString();
			}
			if (s.length === 0)
				return 0;
			var num = parseFloat(s.replace((typeof thousand == "undefined" ? Locale.get('thousand') : thousand), '')
								  .replace((typeof decimal == "undefined" ? Locale.get('decimal') : decimal), "."));
			return isNaN(num) && parseNumber.allowNaN ? 0 : num;
		};

		parseNumber.allowNaN = true;

		Locale.formatNumber = formatNumber;
		Locale.formatDay = formatDay;
		Locale.formatTime = formatTime;
		Locale.timeDiff = timeDiff;
		Locale.printTime = printTime;
		Locale.parseTime = parseTime;
		Locale.parseNumber = parseNumber;
		ns.Key = Key;
		ns.Locale = Locale;
	}
})(window);
