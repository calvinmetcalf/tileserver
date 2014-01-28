
/*
 Copyright (c) 2012, Smartrak, David Leaver
 Leaflet.utfgrid is an open-source JavaScript library that provides utfgrid interaction on leaflet powered maps.
 https://github.com/danzel/Leaflet.utfgrid
*/
(function(window,undefined){L.Util.ajax=function(url,cb){window.XMLHttpRequest===undefined&&(window.XMLHttpRequest=function(){try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(e){throw Error("XMLHttpRequest is not supported")}});var response,request=new XMLHttpRequest;request.open("GET",url),request.onreadystatechange=function(){request.readyState===4&&request.status===200&&(window.JSON?response=JSON.parse(request.responseText):response=eval("("+request.responseText+")"),cb(response))},request.send()},L.UtfGrid=L.Class.extend({includes:L.Mixin.Events,options:{subdomains:"abc",minZoom:0,maxZoom:18,tileSize:256,resolution:4,useJsonP:!0,pointerCursor:!0},_mouseOn:null,initialize:function(e,t){L.Util.setOptions(this,t),this._url=e,this._cache={};var n=0;while(window["lu"+n])n++;this._windowKey="lu"+n,window[this._windowKey]={};var r=this.options.subdomains;typeof this.options.subdomains=="string"&&(this.options.subdomains=r.split(""))},onAdd:function(e){this._map=e,this._container=this._map._container,this._update();var t=this._map.getZoom();if(t>this.options.maxZoom||t<this.options.minZoom)return;e.on("click",this._click,this),e.on("mousemove",this._move,this),e.on("moveend",this._update,this)},onRemove:function(){var e=this._map;e.off("click",this._click,this),e.off("mousemove",this._move,this),e.off("moveend",this._update,this),this.options.pointerCursor&&(this._container.style.cursor="")},_click:function(e){this.fire("click",this._objectForEvent(e))},_move:function(e){var t=this._objectForEvent(e);t.data!==this._mouseOn?(this._mouseOn&&(this.fire("mouseout",{latlng:e.latlng,data:this._mouseOn}),this.options.pointerCursor&&(this._container.style.cursor="")),t.data&&(this.fire("mouseover",t),this.options.pointerCursor&&(this._container.style.cursor="pointer")),this._mouseOn=t.data):t.data&&this.fire("mousemove",t)},_objectForEvent:function(e){var t=this._map,n=t.project(e.latlng),r=this.options.tileSize,i=this.options.resolution,s=Math.floor(n.x/r),o=Math.floor(n.y/r),u=Math.floor((n.x-s*r)/i),a=Math.floor((n.y-o*r)/i),f=t.options.crs.scale(t.getZoom())/r;s=(s+f)%f,o=(o+f)%f;var l=this._cache[t.getZoom()+"_"+s+"_"+o];if(!l)return{latlng:e.latlng,data:null};var c=this._utfDecode(l.grid[a].charCodeAt(u)),h=l.keys[c],p=l.data[h];return l.data.hasOwnProperty(h)||(p=null),{latlng:e.latlng,data:p}},_update:function(){var e=this._map.getPixelBounds(),t=this._map.getZoom(),n=this.options.tileSize;if(t>this.options.maxZoom||t<this.options.minZoom)return;var r=new L.Point(Math.floor(e.min.x/n),Math.floor(e.min.y/n)),i=new L.Point(Math.floor(e.max.x/n),Math.floor(e.max.y/n)),s=this._map.options.crs.scale(t)/n;for(var o=r.x;o<=i.x;o++)for(var u=r.y;u<=i.y;u++){var a=(o+s)%s,f=(u+s)%s,l=t+"_"+a+"_"+f;this._cache.hasOwnProperty(l)||(this._cache[l]=null,this.options.useJsonP?this._loadTileP(t,a,f):this._loadTile(t,a,f))}},_loadTileP:function(e,t,n){var r=document.getElementsByTagName("head")[0],i=e+"_"+t+"_"+n,s="lu_"+i,o=this._windowKey,u=this,a=L.Util.template(this._url,L.Util.extend({s:L.TileLayer.prototype._getSubdomain.call(this,{x:t,y:n}),z:e,x:t,y:n,cb:o+"."+s},this.options)),f=document.createElement("script");f.setAttribute("type","text/javascript"),f.setAttribute("src",a),window[o][s]=function(e){u._cache[i]=e,delete window[o][s],r.removeChild(f)},r.appendChild(f)},_loadTile:function(e,t,n){var r=L.Util.template(this._url,L.Util.extend({s:L.TileLayer.prototype._getSubdomain.call(this,{x:t,y:n}),z:e,x:t,y:n},this.options)),i=e+"_"+t+"_"+n,s=this;L.Util.ajax(r,function(e){s._cache[i]=e})},_utfDecode:function(e){return e>=93&&e--,e>=35&&e--,e-32}}),L.utfGrid=function(e,t){return new L.UtfGrid(e,t)}})(this);