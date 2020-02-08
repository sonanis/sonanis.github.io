class TypeOfField {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
    isInstants(id, name){
        if(id && id == this.id){
            return true;
        }
        if(name && name == this.name){
            return true;
        }
        return false;
    }
    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }
}
ObjectField = new TypeOfField(0, 'Object');
NumField = new TypeOfField(1, 'num');
IntField = new TypeOfField(2, 'int');
DoubleField = new TypeOfField(3, 'double');
StringField = new TypeOfField(4, 'String');
BoolField = new TypeOfField(5, 'bool');
ListField = new TypeOfField(6, 'List');
console.log(ObjectField.id);
FieldType = {};
FieldType[ObjectField.id] = ObjectField.name;
FieldType[NumField.id] = NumField.name;
FieldType[IntField.id] = IntField.name;
FieldType[DoubleField.id] = DoubleField.name;
FieldType[StringField.id] = StringField.name;
FieldType[BoolField.id] = BoolField.name;
FieldType[ListField.id] = ListField.name;


function clearTable() {
    /**
    <thead>
        <tr>
            <th>Notify</th>
            <th>字段类型</th>
            <th>字段名</th>
        </tr>
    </thead>
    */
    var htmlString = [];
    htmlString.push('<thead>');
    htmlString.push('    <tr>');
    htmlString.push('        <th>j_type</th>');
    htmlString.push('        <th>Notify</th>');
    htmlString.push('        <th>字段类型</th>');
    htmlString.push('        <th>字段名</th>');
    htmlString.push('    </tr>');
    htmlString.push('</thead>');

    $("#fieldTable").html(htmlString.join(""));

    //    $("#fieldTable  tr:not(:first)").html("");
    //    $("#fieldTable  tr:not(:first)").empty("");
}

/**
 * j_type字段在json中的类型
 */
function addTdToTable(j_type, fieldName) {
    /**
    <tr>
        <td>
            <input type="checkbox" class="notify_check" >
        </td>
        <td>
            <select class="field_type">
                <option value="1" selected>Object</option>
                <option value="2" >int</option>
                <option value="3" >double</option>
                <option value="4" >String</option>
            </select>
        </td>
        <td>
            <input type="text" class="field_name">
        </td>
    </tr>    
    */
    var str = [];
    str.push('<tr>\n');
    str.push('    <td>\n');
    str.push('        <span>' + j_type + '</span>\n');
    str.push('    </td>\n');
    str.push('    <td>\n');
    str.push('        <input type="checkbox" class="notify_check" >\n');
    str.push('    </td>\n');
    str.push('    <td>\n');
    str.push('        <select class="field_type">\n');

    //    str.push('            <option value="1" selected>Object</option>\n');
    //    str.push('            <option value="2" >int</option>\n');
    //    str.push('            <option value="3" >double</option>\n');
    //    str.push('            <option value="4" >String</option>\n');
    for (var key in FieldType) {
        var name = FieldType[key];
        if (name.toLowerCase() == j_type.toLowerCase()) {
            str.push('            <option value="' + key + '" selected>' + FieldType[key] + '</option>\n');
        } else {
            str.push('            <option value="' + key + '" >' + FieldType[key] + '</option>\n');
        }
    }


    str.push('        </select>\n');
    str.push('    </td>\n');
    str.push('    <td>\n');
    str.push('        <input type="text" class="field_name" value="' + fieldName + '" >\n');
    str.push('    </td>\n');
    str.push('</tr>\n');
    $("#fieldTable").append(str.join(""));
}

window.onload = function () {


    clearTable();
    //    addTdToTable('int', 'code');
    //    addTdToTable('string', 'msg');
    //    addTdToTable('double', 'price');
    //    addTdToTable('bool', 'enable');
    //    addTdToTable('list', 'list');


    function checknumber(obj) {
        if (typeof (obj) == 'boolean') {
            return false;
        }
        return !isNaN(obj);
    }

    function isInteger(obj) {
        return typeof obj === 'number' && obj % 1 === 0
    }

    function isBool(obj) {
        return typeof (obj) == 'boolean';
    }

    function parseInput(el) {
        var val = el.value;
        try {
            var jsonMap = JSON.parse(val);
            //            console.log('parse json: '+JSON.stringify(jsonMap));
            var arr = ["import 'dart:convert';\n\n"];
            var parseMethod = ['final obj = json.decode(jsonContent);\n'];
            for (var key in jsonMap) {
                //                console.log(key+" : "+jsonMap[key]);
                var val = jsonMap[key];
                //                console.log("val type: " + typeof (val));
                if (typeof (val) == 'object') {

                } else {
                    if (checknumber(val)) {
                        if (isInteger(val)) {
                            arr.push('int ');
                            parseMethod.push(key + " = JSON.Int(obj, '" + key + "');\n");
                            addTdToTable('int', key);
                        } else {
                            arr.push('double ');
                            parseMethod.push(key + " = JSON.Double(obj, '" + key + "');\n");
                            addTdToTable('double', key);
                        }
                        arr.push(key);
                        arr.push(' ;\n')


                    } else if (typeof (jsonMap[key]) == 'string') {
                        arr.push('String ' + key + ";\n");
                        parseMethod.push(key + " = JSON.string(obj, '" + key + "');\n");
                        addTdToTable('string', key);
                    } else if (isBool(val)) {
                        arr.push('bool ' + key + ";\n");
                        parseMethod.push(key + " = JSON.Bool(obj, '" + key + "');\n");
                        addTdToTable('bool', key);
                    }
                }

            }
            arr.push("\n");
            arr.push(parseMethod.join(""));
            var code = arr.join("");
            console.log("code: " + code);
        } catch (e) {
            console.log('json格式错误');
        }
    }

    $("#generate_field").click(function () {
        clearTable();
        parseInput(document.getElementById('json'));
    });
    $("#generate_dart").click(function () {
        var dartCode = ["import 'dart:convert';\n\n"];
        var fromJsonCode = ['entity.fromObj(Map obj){\n'];
        dartCode.push('class entity {\n');
        var fieldCode = [];
        $("#fieldTable").find("tr:not(:first)").each(function () {
            var tdArr = $(this).children();
            var j_type = tdArr.eq(0).find("span").text();
            var notify = tdArr.eq(1).find("input").is(":checked");
            var fieldType = tdArr.eq(2).find("select").val();
            var fieldName = tdArr.eq(3).find("input").val();
            fieldCode.push(FieldType[fieldType]+' '+fieldName+';\n');
            fromJsonCode.push('this.'+fieldName+' = JSON.');
            if(fieldType == )
            /*console.log('j_type: '+ tdArr.eq(0).find("span").text());
            console.log('notify: ' + tdArr.eq(1).find("input").is(":checked"));
            console.log('type: ' + tdArr.eq(2).find("select").val());
            console.log('name: ' + tdArr.eq(3).find("input").val());
            console.log("=====================================");*/
        });
        fromJsonCode.push('}');
        dartCode.push(fieldCode.join(""));
        dartCode.push('}');
        $("#result").val(dartCode.join(""));
    });

    var el = document.getElementById('json');
    //    el.addEventListener('input', function () {
    //        parseInput(this);
    //        var len = txtCount(this); //   调用函数 
    //    });
    //
    //    el.addEventListener('propertychange', function () { //兼容IE
    //        
    //    });
}
