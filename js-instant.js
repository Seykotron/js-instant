/*
  Version: 1.0
  Developer: Miguel Angel Romero de los Llanos
  Email: romerodelosllanos@mineryreport.com
  Web: www.mineryreport.com
  Twitter: @s3ik0tr0n
*/
/*
  Object return must have this format:
  {
    "status"  : 1,
    "message" : "Ok",
    "hasNext" : false,
    "hasPrev" : false,
    "currentPage" : 0,
    "data"    : [
      { "nombre" : "Paco", "apellidos" : "Gonzalez", "sexo" : 0, "ciudad" : "Madrid", "edad" : 35, "socio" : true }
    ],
    "filter" : [
      {
        "edad__from" : [10],
        "edad__to"   : [45],
        "sexo"      : [0],
        "socio"     : [false]
      }
    ],
    "order" : [
      "edad" : 0
    ]
  }


  The keys inside data are the column where the info goes.
  The keys inside filter are the Id's of the input widget and the value will always be a list because there are inputs that can handle more than one value (for example selects)
  The keys inside order are the column wich are being ordering this data the value is 0 for ASC and 1 for DESC
  The key currentPage indicates in wich page are we right now
  The keys hasNext and hasPrev indicates if there is next or previous pages
  The key status indicates if the petition has been handled good 1 for ok, 0 for error
  The key message indicate the error in case of or the "Ok" string if the status is one
*/

document.tables = [];
document.inputs = [];

/*
  You need to register every table and every input.
  You MUST register first inputs
*/

/*

  - title: mandatory
  - column_name: mandatory, it defines the name of the column
  - header_class: by default is undefined, if you want to pass id for the header of the column you must do it as an string
  - header_class: by default is undefined, if you want to pass classes for the header of the column you must do it as an array
  - header_attr: by default is undefined, if you want to pass header attributes you must do it as a dictionary
  - td_class: by default is undefined, if you want to pass classes for the td of the column you must do it as an array
  - td_attr: by default is undefined, if you want to pass td attributes you must do it as a dictionary
*/
var JsColumn = function(
  title,
  column_name
  ){
  var obj = {};
  obj.column_name = column_name;
  obj.title       = title;
  obj.header_id   = undefined;
  obj.header_class= undefined;
  obj.header_attr = undefined;
  obj.td_class    = undefined;
  obj.td_attr     = undefined;
  obj.draw_header = function(){
    if( obj.header_id !== undefined ){
      id = obj.header_id;
    }
    else{
      id = "";
    }
    return `<th ${id}>${obj.title}</th>`;
  }
  obj.get_header_classes = function(){
    if( obj.header_class !== undefined ){
      if( Array.isArray(obj.header_class) ){
        var classes = obj.header_class.join(" ");
      }
      else if( typeof obj.header_class == "string" ){
        var classes = obj.header_class;
      }
      else{
        return "";
      }
      return `class="${classes}"`;
    }
    return "";
  }
  obj.get_td_classes = function(){
    if( obj.td_class !== undefined ){
      if( Array.isArray(obj.td_class) ){
        var classes = obj.td_class.join(" ");
      }
      else if( typeof obj.td_class == "string" ){
        var classes = obj.td_class;
      }
      else{
        return "";
      }
      return `class="${classes}"`;
    }
    return "";
  }
  obj.get_header_attrs = function(){
    if( obj.header_attr !== undefined && obj.header_attr == Object ){
      var keys = Object.keys( obj.header_attr );
      var cant = keys.length;
      attrs = [];
      for( var i=0; i<cant; i++ ){
        attrs.push( `${keys[i]}="${obj.header_attr[keys[i]]}"` );
      }
      return attrs.join(" ");
    }
    return "";
  }
  obj.get_td_attrs = function(){
    if( obj.td_attr !== undefined && obj.td_attr == Object ){
      var keys = Object.keys( obj.td_attr );
      var cant = keys.length;
      attrs = [];
      for( var i=0; i<cant; i++ ){
        attrs.push( `${keys[i]}="${obj.td_attr[keys[i]]}"` );
      }
      return attrs.join(" ");
    }
    return "";
  }
  obj.get_header_id = function(){
    if( obj.header_id !== undefined ){
      return `id="${obj.header_id}"`;
    }
    return "";
  }
  obj.get_header = function(){
    var interior = `${obj.get_header_id()}`;
    if( interior !== "" ){
      interior += " ";
    }
    interior += `${obj.get_header_classes()}`;
    if( interior !== "" ){
      interior += " ";
    }
    interior += `${obj.get_header_attrs()}`;
    if( interior !== "" ){
      interior = " "+interior;
    }
    return `<th${interior}>${obj.title}</td>`;
  }

  return obj;
}

var JsTable = function(
  table_name,
  table_id
){
  var obj = {};

  obj.columns     = [];
  obj.data        = [];
  obj.table_name  = table_name;
  obj.table_id    = table_id;
  obj.table_class = undefined;
  obj.table_attr  = undefined;
  obj.odd_class   = undefined;
  obj.even_class  = undefined;
  obj.response    = undefined;

  obj.set_columns     = function( c ){
    obj.columns = c;
  }
  obj.set_data        = function( d ){
    obj.data = d.data;
    obj.response = d;
  }
  obj.append_columns  = function( c ){
    obj.columns.push( c );
  }
  obj.append_data     = function( d ){
    obj.data.push( d );
  }
  obj.clear_columns   = function(){
    obj.columns = [];
    $(`#${obj.table_id}`).children("thead").html("");
  }
  obj.clear_data      = function(){
    obj.data = [];
    $(`#${obj.table_id}`).children("tbody").html("");
  }
  obj.get_table_id = function(){
    if( obj.header_id !== undefined ){
      return `id="${obj.table_id}"`;
    }
    return "";
  }
  obj.get_table_classes = function(){
    if( obj.table_class !== undefined ){
      if( Array.isArray(obj.table_class) ){
        var classes = obj.table_class.join(" ");
      }
      else if( typeof obj.table_class == "string" ){
        var classes = obj.table_class;
      }
      else{
        return "";
      }
      return `class="${classes}"`;
    }
    return "";
  }
  obj.get_table_attrs   = function(){
    if( obj.table_attr !== undefined && obj.table_attr == Object ){
      var keys = Object.keys( obj.table_attr );
      var cant = keys.length;
      attrs = [];
      for( var i=0; i<cant; i++ ){
        attrs.push( `${keys[i]}="${obj.table_attr[keys[i]]}"` );
      }
      return attrs.join(" ");
    }
    return "";
  }
  obj.get_table_headers = function(){
    if( Array.isArray( obj.columns ) ){
      var cant = obj.columns.length;
      if( cant == 0 || typeof obj.columns != "object" ){
        return "";
      }
      var txt = "";
      for( var i=0; i<cant; i++ ){
        txt += `${obj.columns[i].get_header()}`;
      }
      if( txt !== "" ){
        return `<thead><tr>${txt}</tr></thead>\n`;
      }
      return "";
    }
    return "";
  }
  obj.get_table_data    = function(){
    var rows = [];
    var cant_rows = obj.data.length;
    for( var i=0; i<cant_rows; i++ ){
      var row_class = "";
      if( obj.odd_class !== undefined && obj.even_class !== undefined ){
        if( obj.isEven(i) ){
          row_class = `class=${obj.even_class}`;
        }
        else{
          row_class = `class=${obj.odd_class}`;
        }
      }
      var row = obj.data[i];
      var tds = [];
      var cant_columns = obj.columns.length;
      for( var x=0; x<cant_columns; x++ ){
        var columna = obj.columns[x];
        var clave = columna.column_name;
        tds.push( `<td ${columna.get_td_classes()} ${columna.get_td_attrs()}>${row[clave]}</td>` );
      }
      rows.push( `<tr ${row_class}>\n${tds.join("\n")}</tr>` );
    }
    return rows.join("\n");
  }
  obj.isEven            = function(n){
    return n%2 == 0;
  }
  obj.updateData        = function( datos ){
    obj.clear_data();
    obj.set_data( datos );
    $(`#${obj.table_id}`).children("tbody").html( obj.get_table_data() );
  }

  return obj;
}

var JsForm = function( idForm, ajaxURL, inputList, type="GET",test=true){
  var obj = {};

  obj.data = {};
  obj.id    = idForm;
  obj.baseUrl = ajaxURL;
  obj.url   = ajaxURL;
  obj.type  = type; // POST or GET
  obj.inputList = inputList; // The id of every input
  obj.test  = test;
  obj.childDependantDefault = {};
  obj.dependantSelectParams = [];
  obj.bindDependant = function(){
    for( var args of obj.dependantSelectParams  ){
      obj.dependantSelect(...args);
    }
  }

  obj.getData = function(){
    for( var input of obj.inputList ){
      if( $(`#${input}`).attr("type") !== "checkbox" &&  $(`#${input}`).attr("name") !== undefined && ( $(`#${input}`).val() !== undefined ) ){
        obj.data[ $(`#${input}`).attr("name") ] = $(`#${input}`).val();
      }
      else if ($(`#${input}`).attr("type") == "checkbox") {
        obj.data[ $(`#${input}`).attr("name") ] = $(`#${input}`).prop("checked") == true ? 1 : 0;

        if( obj.data[ $(`#${input}`).attr("name") ] == 0 ){
          delete obj.data[ $(`#${input}`).attr("name") ];
        }
      }
    }
  }

  obj.unbindEvents = function(){
    for( var input of obj.inputList ){
      $(`#${input}`).unbind();
    }
  }

  /*
    This function binds the on change event of every input to make an Ajax query and throw the response to the "afterFunction"
    The afterFunction must receive a first param wich will be the status (0 - error, 1 - OK) and the data response of the Ajax request
  */
  obj.bindEvents = function( afterFunction ){
    obj.unbindEvents();

    for( var input of obj.inputList ){
      $(`#${input}`).change(function(){
        obj.buildURL();
        var objAjax = { url: obj.url, dataType: "json", type: obj.type };
        if( obj.test ){
          objAjax.dataType = "text";
          if( obj.type !== "GET" ){
            objAjax["data"] = obj.data;
          }
          console.log( objAjax );
          $("#salida").html( JSON.stringify(objAjax) );
        }

        objAjax.success = function(data){
          if( obj.test ){
            data = JSON.parse( data );
            console.log("Success!");
          }
          if( data.status > 0 ){
            afterFunction( data );
            console.log("Status Ok!");
          }
          else{
            M.toast({html: `<b class="red-text">Error:</b>&nbsp;Ocurrió un error en tu petición y no se ha podido realizar la acción.</br>${data.mesage}`});
          }
        };

        objAjax.error = function(error){
          M.toast({html: '<b class="red-text">Error:</b>&nbsp;Ocurrió un error en la petición y no se pudo realizar.'});
        };

        $.ajax( objAjax );

      });
    }

    obj.bindDependant();
  }

  obj.buildURL = function(){
    obj.getData();
    if( obj.type == "GET" ){
      var valores = [];
      for( var input in obj.data ){
        if( Array.isArray( obj.data[input] ) ){
          for( var dato of obj.data[input] ){
            valores.push( `${input}[]=${encodeURI(dato)}` );
          }
        }
        else{
          if( obj.data[input] !== undefined && obj.data[input] != null ){
            valores.push( `${input}=${encodeURI(obj.data[input])}` );
          }
        }
      }
      txtValores = valores.join("&");
      obj.url =`${obj.baseUrl}?${txtValores}`;
      return obj.url ;
    }
    return obj.baseUrl;
  }

  obj.reset = function(){
    obj.unbindEvents();
    $(`#${obj.id}`)[0].reset();
    for( var key in obj.childDependantDefault ){
      $(`#${key}`).html( obj.childDependantDefault[key] );
    }
    obj.updateWidgets();
  }

  obj.updateWidgets = function(){
    var elems = document.querySelectorAll(`#${obj.id} select`);
    var instances = M.FormSelect.init(elems);
    M.updateTextFields();
  }

  obj.dependantSelect = function( parent, child, url, load_message ){

    obj.childDependantDefault[ child ] = $(`#${child}`).html();

    $(`#${parent}`).change(function(){

      $(`#${child}`).html( `<option value="" selected disabled>${load_message}</option>` );

      var name = $(`#${parent}`).attr("name");
      var val = $(`#${parent}`).val();
      var valores = [];

      if( Array.isArray( val ) ){
        for( var dato of val ){
          valores.push( `${name}[]=${encodeURI(dato)}` );
        }
      }
      else{
        if( val !== undefined && val != null ){
          valores.push( `${name}=${encodeURI(val)}` );
        }
      }

      txtValores = valores.join("&");
      urlFinal =`${url}?${txtValores}`;

      if( obj.test ){
        tipo_dato = "text";
      }
      else{
          tipo_dato = "json";
      }

      var objAjax = { url: urlFinal, dataType: tipo_dato, type: "GET" };

      objAjax.success = function(data){
        if( obj.test ){
          data = JSON.parse( data );
          console.log("Success!");
        }
        if( data.status > 0 ){
          $(`#${child}`).html( obj.buildSelectOptions( data.data ) );
        }else{
          M.toast({html: `<b class="red-text">Error:</b>&nbsp;Ocurrió un error en tu petición y no se ha podido realizar la acción.</br>${data.mesage}`});
        }
        obj.updateWidgets();
      };

      objAjax.error = function(error){
        M.toast({html: '<b class="red-text">Error:</b>&nbsp;Ocurrió un error en la petición y no se pudo realizar.'});
      };

      $.ajax(objAjax);

    });
  }

  obj.append_dependantSelect = function( parent, child, url, load_message ){
    obj.dependantSelectParams.push( [parent, child, url, load_message] );
  }

  obj.buildSelectOptions = function( dict ){
    var valores = [];
    for( var option of dict ){
      var txt_selected = "";
      var txt_disabled = "";
      var txt_value = "";
      if( "selected" in option && option.selected === true ){
        txt_selected = " selected ";
      }
      if( "disabled" in option && option.disabled === true ){
        txt_disabled = " disabled ";
      }
      if( "id" in option ){
        txt_value = ` value="${option.id}" `;
      }
      else{
        txt_value = ` value="" `;
      }
      valores.push( `<option ${txt_value}${txt_selected}${txt_disabled}>${option.name}</option>` );
    }
    return valores.join("\n");
  }

  return obj;
}

var JsInstant = function(){
  var obj = {};

  obj.seekTables = function(){
    var tablas = $("table");
    var cant = tablas.length;

    for( var i=0; i<cant; i++ ){
        var tabla = tablas[i];
        var tablaJQ = $(tabla);
        var nombre  = tablaJQ.data("name");
        var id      = tabla.id;
        var clases  = tabla.classList;
        var attrs_p = tabla.attributes;
        var attrs   = {};
        var cant_at = attrs_p.length;
        for( var x=0; x<cant_at; x++ ){
          var attr = attrs_p[x];
          if( attr.name != "id" && attr.name != "class" ){
            attrs[ attr.name ] = attr.value;
          }
        }

        objTabla = JsTable( nombre, id );
        objTabla.table_class = clases;
        objTabla.table_attr  = attrs;

        objTabla.set_columns( obj.seekColumns( tabla ) );

        document.tables.push( objTabla );
    }

  }

  obj.seekColumns = function( table ){
    var columnas = [];
    var thead = $(table).find("thead");
    var trs   = $(thead).children("tr");
    var cant_tr = trs.length;
    for( var i=0; i<cant_tr; i++ ){
      var tr = trs[i];
      var ths = $(tr).children("th");
      var cant_th = ths.length;
      for( var x=0; x<cant_th; x++ ){
        var th      = ths[x];
        var thJQ    = $(th);
        var nombre  = thJQ.data("name");
        var titulo  = thJQ.html();
        var id      = th.id;
        var clases  = th.classList;
        var attrs_p = th.attributes;
        var attrs   = {};
        var cant_at = attrs_p.length;
        for( var j=0; j<cant_at; j++ ){
          var attr = attrs_p[j];
          if( attr.name != "id" && attr.name != "class" ){
            attrs[ attr.name ] = attr.value;
          }
        }

        objColumna = JsColumn( titulo, nombre );
        objColumna.header_id = id;
        objColumna.header_class = clases;
        objColumna.header_attr = attrs;
        columnas.push( objColumna );
      }
    }

    return columnas;
  }

  obj.instanceForm = function( formId ){
    $(`#${formId} input`).change(  );
  }

  return obj;
}
