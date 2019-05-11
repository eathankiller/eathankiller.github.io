var comments = {
	"debug": {},
	"comments": []
}["comments"];
if (typeof hcb_user === "undefined") {
	hcb_user = {}
}
var extend = function(o1, o2) {
	for (var i in o2) {
		if (typeof o1[i] === 'undefined') {
			o1[i] = o2[i]
		}
	}
	return o1
};
hcb_user = extend(hcb_user, {
	comments_header: 'Comments',
	name_label: 'Name',
	content_label: 'Enter your comment here',
	submit: 'Comment',
	logout_link: '<img title="log out" src="https://www.htmlcommentbox.com/static/images/door_out.png" alt="[logout]" class="hcb-icon hcb-door-out"/>',
	admin_link: '<img src="https://www.htmlcommentbox.com/static/images/door_in.png" alt="[login]" class="hcb-icon hcb-door-in"/>',
	no_comments_msg: 'No one has commented yet. Be the first!',
	add: 'Add your comment',
	again: 'Post another comment',
	rss: '<img src="https://www.htmlcommentbox.com/static/images/feed.png" class="hcb-icon" alt="rss"/> ',
	said: 'said:',
	prev_page: '<img src="https://www.htmlcommentbox.com/static/images/arrow_left.png" class="hcb-icon" title="previous page" alt="[prev]"/>',
	next_page: '<img src="https://www.htmlcommentbox.com/static/images/arrow_right.png" class="hcb-icon" title="next page" alt="[next]"/>',
	showing: 'Showing',
	to: 'to',
	website_label: 'website (optional)',
	email_label: 'email',
	anonymous: 'Anonymous',
	mod_label: '(mod)',
	subscribe: 'email me replies',
	are_you_sure: 'Do you want to flag this comment as inappropriate?',
	reply: '<img src="https://www.htmlcommentbox.com/static/images/reply.png"/> reply',
	flag: '<img src="https://www.htmlcommentbox.com/static/images/flag.png"/> flag',
	like: '<img src="https://www.htmlcommentbox.com/static/images/like.png"/> like',
	days_ago: 'days ago',
	hours_ago: 'hours ago',
	minutes_ago: 'minutes ago',
	within_the_last_minute: 'within the last minute',
	msg_thankyou: 'Thank you for commenting!',
	msg_approval: '(this comment is not published until approved)',
	msg_approval_required: 'Thank you for commenting! Your comment will appear once approved by a moderator.',
	err_bad_html: 'Your comment contained bad html.',
	err_bad_email: 'Please enter a valid email address.',
	err_too_frequent: 'You must wait a few seconds between posting comments.',
	err_comment_empty: 'Your comment was not posted because it was empty!',
	err_denied: 'Your comment was not accepted.',
	err_unknown: 'Your comment was blocked for unknown reasons, please report this.',
	err_spam: 'Your comment was detected as spam.',
	err_blocked: 'Your comment was blocked by site policy.',
	MAX_CHARS: 8192,
	PAGE: '',
	ON_COMMENT: function() {},
	RELATIVE_DATES: true
});
var OPTS = {
		'opt_watermark': 256,
		'opt_field_website': 1024,
		'opt_date': 4,
		'opt_field_email': 512,
		'opt_top': 2,
		'opt_sub': 8,
		'opt_collapse': 1,
		'opt_rss': 128,
		'opt_site': 32,
		'opt_gravatar': 64,
		'opt_email_required': 4096,
		'opt_querystring': 2048,
		'opt_pfilter': 16,
		'opt_stop': 8192,
		'opt_replies': 16384
	},
	opts = 16862,
	likes = true,
	pagenum = 0,
	host = 'https://www.htmlcommentbox.com',
	msg = '',
	mod = '$1$wq1rdBcg$WCKeRV3D.RF8VN7GcM1gZ.+',
	user = {
		name: 'eathankiller777',
		email: 'eathankiller777@gmail.com',
		is_mod: false,
		subscribed: false
	},
	removed_backlink = false,
	auth_link = 'https://www.htmlcommentbox.com/logout?then=/',
	page_link = 'https://www.htmlcommentbox.com/jread?page=&mod=%241%24wq1rdBcg%24WCKeRV3D.RF8VN7GcM1gZ.%2B&opts=16862&num=10&ts=1557510286200',
	pagination = '',
	gravatar_url = '856af9c179a55974c87935c14cffb1df',
	image_policy = 'allow';
var hcb = {};
(function() {
	var page = hcb_user.PAGE || (window.location + '').replace(/\'/g, "%27");
	var get_option = function(name) {
			return opts & OPTS['opt_' + name]
		},
		_hcb = hcb,
		_hcb_user = hcb_user,
		_document = document,
		collapsed_link = function() {
			if (!_hcb_user.again) return '';
			return '<div id="HCB_comment_form_box"><a class="btn" href="javascript:hcb.make_comment_form()">' + (posted ? _hcb_user.again : _hcb_user.add) + '</a></div>'
		},
		rss_link = '<a href="' + host + '/rss_clean?page=' + encodeURIComponent(page) + '&opts=' + opts + '&mod=' + mod + '" style="text-decoration:none"/>' + _hcb_user.rss + '</a>',
		shadow_start = '<div class="hcb-shadow-t"> <div class="hcb-shadow-tl"></div> <div class="hcb-shadow-tr"></div> </div> <div class="hcb-shadow-m">',
		shadow_end = '</div> <div class="hcb-shadow-b"> <div class="hcb-shadow-bl"></div> <div class="hcb-shadow-br"></div> </div><div class="hcb-shadow-clear"></div>',
		head = _document.getElementsByTagName("head")[0],
		is_tablet = function() {
			return (navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i))
		},
		get_element = function(id) {
			return (_document.all && _document.all[id]) || _document.getElementById(id)
		},
		remove_element = function(node) {
			if (node) node.parentNode.removeChild(node)
		},
		instr = function(haystack, needle) {
			return (haystack || '').indexOf(needle) !== -1
		},
		insert_script = function(src) {
			s = _document.createElement("script");
			s.setAttribute("type", "text/javascript");
			s.setAttribute("src", src);
			head.appendChild(s)
		},
		textfield = function(name, value) {
			return '<div class="hcb-wrapper-half input-field">' + shadow_start + '<input id="hcb_form_' + name + '" class="hcb-shadow-r" name="' + name + '" type="text" value="' + (value || '') + '" ' + (get_option('watermark') ? ' placeholder="' + _hcb_user[name + '_label'] + '">' : '>') + shadow_end + ' </div>'
		},
		hiddenfield = function(name, value) {
			return '<input type="hidden" name="' + name + '" value="' + value + '" id="hcb_form_' + name + '" />'
		},
		http_get = function(strURL, query) {
			insert_script(strURL + "?" + query)
		},
		xd_post = function(url, data) {
			var input, iframe = _document.createElement("iframe");
			var uniqueString = "" + Math.random();
			_document.body.appendChild(iframe);
			iframe.style.display = "none";
			iframe.contentWindow.name = uniqueString;
			var form = _document.createElement("form");
			form.target = uniqueString;
			form.action = url;
			form.enctype = 'multipart/form-data';
			form.method = "POST";
			form.style = "display:none";
			for (var item in data) {
				input = _document.createElement("input");
				input.type = (item == 'hcb_file' ? 'file' : "hidden");
				input.style = "display:none";
				input.name = item;
				input.value = data[item];
				form.appendChild(input)
			}
			_document.body.appendChild(form);
			form.submit()
		},
		fields = ['email', 'name', 'website', 'content'],
		by_class = function(elements, cls) {
			for (var i = 0; i < elements.length; i++) {
				if (elements[i].className == cls) return elements[i]
			}
		},
		write_msg = function(msg) {
			get_element('hcb_msg').innerHTML = msg
		},
		write_err = function(msg) {
			get_element('hcb_msg').className = 'hcb-err';
			write_msg(msg)
		},
		months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
		render_date = function(timestamp) {
			var now = (new Date()).valueOf() / 1000;
			var diff = now - timestamp;
			if (diff > 24 * 3600 * 7 || !_hcb_user.RELATIVE_DATES) {
				var d = new Date(timestamp * 1000);
				return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear()
			}
			if (diff > 24 * 3600) return Math.floor(diff / (24 * 3600)) + ' ' + _hcb_user.days_ago;
			if (diff > 3600) return Math.floor(diff / 3600) + ' ' + _hcb_user.hours_ago;
			if (diff > 60) return Math.floor(diff / 60) + ' ' + _hcb_user.minutes_ago;
			return _hcb_user.within_the_last_minute
		},
		get_charset = function() {
			return _document.inputEncoding || _document.characterSet || _document.charset || _document.defaultCharset || 'utf-8'
		},
		stop = function() {
			return get_option('stop')
		},
		render_comment = function(C) {
			h = '<div class="comment" id="comment_' + C.key + '">';
			if (user.is_mod) {
				h += '<b class="hcb-link del" title="delete comment" onclick="hcb.del(\'' + C.key + '\')" ><img src="' + host + '/static/images/delete.png" class="hcb-icon" alt="[delete]" /></b>&nbsp;';
				if (!C.approved) {
					h += '<b class="hcb-link del approval-msg" title="approve comment" onclick="hcb.approve(\'' + C.key + '\')" ><img src="' + host + '/static/images/accept.png" class="hcb-icon" alt="[approve]" /></b>&nbsp;'
				}
			}
			if (C.date) h += '<span class="date">(' + render_date(C.date) + ') </span>';
			h += '<span class="author' + (instr(C.author, '(mod)') ? ' hcb-mod' : '') + '"><b class="author-name">' + (C.website ? '<a rel="nofollow" target="_blank" href="' + C.website + '">' : '') + C.author.replace('(mod)', _hcb_user.mod_label) + (C.website ? '</a> ' : ' ') + (C.email ? '<i class="author-email">' + C.email + '</i>' : '') + '</b> ' + _hcb_user.said + '</span> <blockquote>' + (C.gravatar ? '<img align="left" class="gravatar" src="https://www.gravatar.com/avatar/' + C.gravatar + '?s=40&d=' + encodeURIComponent('http://htmlcommentbox.com/static/images/gravatar.png') + '" />' : '') + (C.comment + ' ').replace(/(https?:\/\/|)((?:[a-z0-9][a-z0-9-]{0,61}[a-z0-9]\.|[a-z0-9]\.)+(?:[a-z]{2}|ASIA|BIZ|COM|COOP|EDU|GOV|INFO|JOBS|MOBI|NAME|NET|ORG|XXX))([\/#?][-A-Z0-9+&@#\/%?=~_|!:.;]*[-A-Z0-9+&@#\/%=~_|]|)([\s\.])/ig, function(match, protocol, site, path, delimiter) {
				return "<a target='_blank' rel='nofollow' href='" + (protocol || "//") + site + path + "'>" + site + path + "</a>" + delimiter
			}) + '</blockquote>' + (C.image_path ? '<a href="' + host + C.image_path.replace('/storage/', '/storage/lg_') + '"><img src="' + host + C.image_path + '"></a>' : '');
			if (!C.approved) h += '<p style="opacity:0.6" class="approval-msg">' + _hcb_user.msg_approval + '</p>';
			h += '<p class="hcb-comment-tb">';
			h += '<a class="hcb-flag" href="javascript:hcb.flag(\'' + C.key + '\')">' + _hcb_user.flag + '</a> ';
			if (likes) h += '<a class="hcb-like" href="javascript:hcb.like(\'' + C.key + '\')">' + _hcb_user.like + '</a> ';
			if (get_option('replies')) h += '<a class="hcb-reply" href="javascript:hcb.reply(\'' + C.key + '\')">' + _hcb_user.reply + '</a> ';
			h += '</p>';
			if (likes) h += '<div class="likes" ' + (C.likes ? '' : 'style="display:none"') + '><span>' + C.likes + ' </span><img src="' + host + '/static/images/like.png"/></div>';
			by[C.key] = C.author;
			by[C.author] = C.key;
			return h + '</div>'
		},
		init = function() {
			var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
			var eventer = window[eventMethod];
			var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
			eventer(messageEvent, function(e) {
				if (instr(e.origin + '/', host)) {
					if (e.data.success === false) {
						write_msg(eval('(' + e.data.msg + ')'))
					} else if (e.data.comments && e.data.comments[0] && e.data.comments[0].author) {
						if (typeof console !== 'undefined') console.log(e.data.debug);
						write_msg(_hcb_user.msg_thankyou);
						var cl = get_element('comments_list');
						if (get_option('top')) {
							cl.innerHTML = render_comment(e.data.comments[0]) + cl.innerHTML
						} else {
							cl.innerHTML = cl.innerHTML + render_comment(e.data.comments[0])
						}
						remove_element(get_element('no_comments'));
						posted = true;
						get_element('HCB_comment_form_box').innerHTML = collapsed_link();
						hcb_user.ON_COMMENT()
					}
				}
			}, false);
			var hcb_wrapper, i, C, p = hcb_wrapper = get_element('HCB_comment_box');
			while (p.parentNode && p.tagName !== 'HTML') {
				p = p.parentNode;
				if (p.tagName === 'FORM') {
					alert("Warning: The HTML Comment Box code is inside a form element. Comments won't be submitted.")
				}
			}
			if (instr(page, 'opensocial.googleusercontent')) {
				alert("Warning: It looks like you are using HTML Comment Box with Google Sites but didn't specify the page before copying your code. Re-copy your code with the correct options from https://www.htmlcommentbox.com.")
			}
			width = hcb_wrapper.offsetWidth;
			var H = '#HCB_comment_box ';
			var h = '<h3>' + (_hcb_user.comments_header || 'Comments') + '</h3>' + '<style type="text/css">' + H + '#HCB_comment_form_box{padding-bottom:1em}' + H + '.hcb-link{cursor:pointer}' + H + '.hcb-icon{border:0px transparent none}' + H + 'textarea {display:block;width:100%;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;width: 100%}' + H + 'blockquote{margin:10px;overflow:hidden}' + H + '.hcb-err{color:red}' + H + '.hcb-comment-tb{margin:0}' + H + '.comment{position:relative}' + (get_option('stop') ? "HCB_comment_form_box{opacity:0.5}" : '') + H + '.comment .likes{position:absolute;top:0;right:0;opacity:0.8}' + (is_tablet() ? '' : H + '.comment .hcb-comment-tb a{visibility:hidden}') + H + '.comment:hover .hcb-comment-tb a{visibility:visible}' + H + '.gravatar{padding-right:2px}' + H + 'input{margin-left:0}' + H + 'input[type="file"]{display:none}' + H + 'input.inputfile{width:.1px;height:.1px;opacity:0;overflow:hidden;position:absolute;z-index:-1}' + H + 'input.inputfile+label {display: inline}' + '</style>';
			h += '<p id="hcb_msg">' + (msg ? msg : '') + '</p>';
			if (get_option('top') && !stop()) {
				h += collapsed_link()
			}
			h += '<div id="comments_list">';
			if (comments.length === 0) {
				h += '<p id="no_comments">' + _hcb_user.no_comments_msg + '</p>'
			} else {
				for (var ii = 0; ii < comments.length; ii++) {
					i = get_option('top') ? ii : comments.length - 1 - ii;
					h += render_comment(comments[i])
				}
			}
			h += "</div>";
			if (!get_option('top') && !stop()) {
				h += collapsed_link()
			}
			h += pagination;
			if (get_option('rss')) h += rss_link;
			hcb_wrapper.innerHTML = h;
			(typeof _hcb_user.onload === 'function') && _hcb_user.onload()
		},
		by = {};
	extend(hcb, {
		rsp_cb: function() {
			if (!(_hcb.rsp || {}).success) {
				alert((_hcb.rsp || {}).reason)
			}
		},
		approve: function(key) {
			comment = get_element('comment_' + key);
			for (i = 0; i < comment.childNodes.length; i++) {
				child = comment.childNodes[i];
				if (child && child.className && instr(child.className, 'approval-msg')) {
					remove_element(child)
				}
			}
			http_get('' + host + '/approve', 'key=' + key + '&opts=' + opts)
		},
		del: function(key) {
			remove_element(get_element('comment_' + key));
			http_get('' + host + '/delete', 'key=' + key + '&opts=' + opts)
		},
		flag: function(key) {
			if (!confirm(_hcb_user.are_you_sure)) return;
			var e = by_class(get_element('comment_' + key).children, 'hcb-comment-tb');
			remove_element(e.children[0]);
			http_get('' + host + '/flag', 'key=' + key + '&opts=' + opts)
		},
		like: function(key) {
			var e = by_class(get_element('comment_' + key).children, 'hcb-comment-tb');
			remove_element(e.children[1]);
			var e = by_class(get_element('comment_' + key).children, 'likes');
			e.children[0].innerText = (e.children[0].innerText || 0) * 1 + 1 + ' ';
			e.style.display = 'block';
			http_get('' + host + '/like', 'key=' + key + '&opts=' + opts)
		},
		delta: function(event) {
			var el = event.target || event.srcElement;
			if ((el.textLength || el.value.length) > _hcb_user.MAX_CHARS) {
				el.value = el.value.substr(0, _hcb_user.MAX_CHARS)
			}
		},
		submit: function() {
			if (get_option('field_email') && get_option('email_required')) {
				var email_el = get_element('hcb_form_email');
				if (!/^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,4}$/.test(email_el.value.toUpperCase())) {
					write_err(_hcb_user.err_bad_email);
					return false
				}
			}
			var f, refer;
			for (var i = 0; i < fields.length; i++) {
				f = get_element('hcb_form_' + fields[i]);
				if (f && (f.value === hcb_user[fields[i] + '_label'] || f.value == '')) {
					f.value = (fields[i] == 'name' ? _hcb_user.anonymous : '')
				}
			}
			var reply_to = get_element('hcb_form_content').value.match(/@[^\n\s\,]+/) || [],
				uname;
			for (i = 0; i < reply_to.length; i++) {
				uname = reply_to[i].replace("@", "");
				if (by[uname]) {
					get_element('hcb_form_replies_to').value = by[uname];
					break
				}
			}
			if (window.postMessage) {
				var form = get_element('hcb_form'),
					data = {
						ajax: !(_hcb_user.ajax === false)
					};
				for (i = 0; i < form.length; i++) {
					if (form[i].type === "checkbox" && !form[i].checked) continue;
					data[form[i].name] = form[i].value;
				}
				xd_post(host + '/post', data);
				return false
			} else {
				return true
			}
		},
		reply: function(key) {
			if (!get_element('hcb_form_replies_to')) _hcb.make_comment_form();
			get_element('hcb_form_replies_to').value = key;
			var ta = get_element('hcb_form_content');
			ta.scrollIntoView(false);
			ta.value = '@' + by[key].replace(" <i>(mod)</i>", "").replace(" (mod)", "") + ',\n' + ta.value
		},
		changepage: function(rel) {
			insert_script(page_link + "&pagenum=" + (pagenum + rel))
		},
		make_comment_form: function() {
			var submit_html = '<input class="submit btn" id="hcb_submit" type="submit" value="' + _hcb_user.submit + '" />';
			if (new String(window.location).substring(0, 8) == 'file:///') submit_html = '<input class="submit" id="hcb_submit" disabled="disabled" type="submit" value="Disabled (Publish First!)" />';
			var f = '<form id="hcb_form" enctype="multipart/form-data" onsubmit="return hcb.submit()" action="' + host + '/post" method="post">';
			f += hiddenfield('page', page) + '<input type="hidden" id="hcb_refer" name="refer" value="' + (instr('' + page, 'mosso') ? _document.referrer : window.location + '' + (window.location.hash ? '' : '#HCB_comment_box')) + '" />' + hiddenfield("opts", opts) + hiddenfield("mod", mod) + hiddenfield("replies_to", "") + hiddenfield("charset", get_charset());
			f += textfield('name', user.name);
			if (get_option('field_website')) f += textfield('website', '');
			if (get_option('field_email')) f += textfield('email', user.email);
			var s = '';
			f += '<div class="hcb-wrapper">' + shadow_start + '<textarea onkeypress="hcb.delta(event)" class="commentbox hcb-shadow-r" name="content" id="hcb_form_content" rows="4" ' + s + ' ' + (get_option('watermark') ? ' placeholder="' + _hcb_user['content_label'] + '"' : '') + '></textarea>' + shadow_end + '</div>' + '<div>' + submit_html + '&nbsp;';
			if ('block' !== image_policy) {
				f += '<input type="file" name="hcb_file" id="hcb_file" class="inputfile" title="upload image"><label for="hcb_file" title="upload image"><a class="btn">Add Image</a></label>'
			}
			if (!removed_backlink) {
				f += '<span class="home-desc">&nbsp;&nbsp;</span><a href=""> </a><span class="home-desc">&nbsp; </a>';
				if (user.is_mod) {
					f += '<small class="admin-link"><a href="' + host + '/pricing.html" title="remove link" target="_blank"><img src="' + host + '/static/images/link_delete.png" alt="remove link" class="hcb-icon" /></a></small> '
				}
			}
			if (user.email) {
				f += '&nbsp;<small><a href="' + host + '/account.html" title="account" target="_blank"><img src="' + host + '/static/images/cog.png" alt="account" class="hcb-icon"/></a></small>'
			}
			if (get_option('replies') && (get_option('field_email') || user.email)) {
				f += '<span style="font-size:10px"> <input type="checkbox" name="subscribe" ' + (user.subscribed ? 'checked' : '') + '/> ' + _hcb_user.subscribe + '</span>'
			}
			if (auth_link && !_hcb_user.iframe) {
				f += '<div style="float:right"><small class="admin-link"><a href="' + auth_link + '">' + (user.name ? _hcb_user.logout_link : _hcb_user.admin_link) + '</a>&nbsp;</small></div><div style="clear:both"></div>'
			}
			f += '</div></form>';
			get_element("HCB_comment_form_box").innerHTML = f;
			_hcb.interactive_file_elements()
		},
		interactive_file_elements: function() {
			var inputs = document.querySelectorAll('.inputfile');
			Array.prototype.forEach.call(inputs, function(input) {
				var label = input.nextElementSibling;
				input.addEventListener('change', function(e) {
					var fileName = e.target.value.split('\\').pop();
					if (fileName) {
						label.innerHTML = fileName
					}
				})
			})
		}
	});
	var posted = instr(msg, _hcb_user.msg_thankyou) || instr(msg, _hcb_user.msg_approval_required);
	init();
	if (!get_option('collapse') && !stop() && !posted) {
		_hcb.make_comment_form()
	}
})();