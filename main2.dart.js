class TypeOfField {
    constructor(id, name, jsonName) {
        this.id = id;
        this.name = name;
        this.jsonName = jsonName;
    }
    isInstantsOfId(id) {
        if (id && id == this.id) {
            return true;
        }
        return false;
    }
    isInstantsOfName(name) {
        if (name && name.toLowerCase() == this.name.toLowerCase()) {
            return true;
        }
        return false;
    }
    isInstantsOfJsonName(jsonName) {
        if (jsonName && jsonName.toLowerCase() == this.jsonName.toLowerCase()) {
            return true;
        }
        return false;
    }
    toString() {
        return '(' + this.x + ', ' + this.y + ')';
    }
}

ObjectField = new TypeOfField(0, 'Object', 'Object');
NumField = new TypeOfField(1, 'num', 'number');
IntField = new TypeOfField(2, 'int', 'int');
DoubleField = new TypeOfField(3, 'double', 'double');
StringField = new TypeOfField(4, 'String', 'String');
BoolField = new TypeOfField(5, 'bool', 'boolean');
ListField = new TypeOfField(6, 'List', 'List');

//FieldType = {
//    0: 'Object',
//    1: 'num',
//    2: 'int',
//    3: 'double',
//    4: 'String',
//    5: 'bool',
//    6: 'List',
//};

FieldType = {};
FieldType[ObjectField.id] = ObjectField.name;
FieldType[NumField.id] = NumField.name;
FieldType[IntField.id] = IntField.name;
FieldType[DoubleField.id] = DoubleField.name;
FieldType[StringField.id] = StringField.name;
FieldType[BoolField.id] = BoolField.name;
FieldType[ListField.id] = ListField.name;

AllFieldType = [
    ObjectField,
    NumField,
    IntField,
    DoubleField,
    StringField,
    BoolField,
    ListField
];
//console.log(AllFieldType);

function getFieldOfId(id) {
    var result;
    AllFieldType.forEach(function (field, i) {
        if (field.id == id) {
            result = field;
        }
    });
    return result;
}


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
 * j_type:字段在json中的类型
 */
function addTdToTable(typeOfField, fieldName) {
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
    str.push('        <span data-type-id="' + typeOfField.id + '">' + typeOfField.jsonName + '</span>\n');
    str.push('    </td>\n');
    str.push('    <td>\n');
    str.push('        <input type="checkbox" class="notify_check" >\n');
    str.push('    </td>\n');
    str.push('    <td>\n');
    str.push('        <select class="field_type">\n');

    AllFieldType.forEach(function (field, i) {

        if (field.id == typeOfField.id) {
            str.push('            <option value="' + field.id + '" selected>' + field.name + '</option>\n');
        } else {
            str.push('            <option value="' + field.id + '" >' + field.name + '</option>\n');
        }
    });

    str.push('        </select>\n');
    str.push('    </td>\n');
    str.push('    <td>\n');
    str.push('        <input type="text" class="field_name" value="' + fieldName + '" >\n');
    str.push('    </td>\n');
    str.push('</tr>\n');
    $("#fieldTable").append(str.join(""));
}

function generateFromJsonOfIntField(name) {
    return '\t' + name + ' = JSON.Int(obj,"' + name + '");\n';
}

function generateFromJsonOfDoubleField(name) {
    return '\t' + name + ' = JSON.Double(obj, "' + name + '");\n'
}

function generateFromJsonOfNumField(name) {
    return '\t' + name + ' = JSON.Num(obj, "' + name + '");\n';
}

function generateFromJsonOfStringField(name) {
    return '\t' + name + ' = JSON.string(obj, "' + name + '");\n';
}

function generateFromJsonOfBoolField(name) {
    return '\t' + name + ' = JSON.Bool(obj, "' + name + '");\n';
}


function generateFromJsonOfField(originalFieldType, selectFieldType, name) {
    /*if(originalFieldType.id == selectFieldType.id){
        if(selectFieldType.id == IntField.id){
            return generateFromJsonOfIntField(name);
        }else if(selectFieldType.id == DoubleField.id){
            return generateFromJsonOfDoubleField(name);
        }else if(selectFieldType.id == NumField.id){
            return generateFromJsonOfNumField(name);
        }else if(selectFieldType.id == StringField.id){
            return generateFromJsonOfStringField(name);
        }else if(selectFieldType.id == BoolField.id){
            return generateFromJsonOfBoolField(name);
        }
    }else if(originalFieldType.id == IntField.id && selectFieldType.id == BoolField.id){
        return generateFromJsonOfBoolField(name);
    }*/
    if (selectFieldType.id != ObjectField.id) {
        if (selectFieldType.id == IntField.id) {
            return generateFromJsonOfIntField(name);
        } else if (selectFieldType.id == DoubleField.id) {
            return generateFromJsonOfDoubleField(name);
        } else if (selectFieldType.id == NumField.id) {
            return generateFromJsonOfNumField(name);
        } else if (selectFieldType.id == StringField.id) {
            return generateFromJsonOfStringField(name);
        } else if (selectFieldType.id == BoolField.id) {
            return generateFromJsonOfBoolField(name);
        }
    }
    return '';
}

window.onload = function () {


    clearTable();


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
                            addTdToTable(IntField, key);
                        } else {
                            arr.push('double ');
                            parseMethod.push(key + " = JSON.Double(obj, '" + key + "');\n");
                            addTdToTable(DoubleField, key);
                        }
                        arr.push(key);
                        arr.push(' ;\n')


                    } else if (typeof (jsonMap[key]) == 'string') {
                        arr.push('String ' + key + ";\n");
                        parseMethod.push(key + " = JSON.string(obj, '" + key + "');\n");
                        addTdToTable(StringField, key);
                    } else if (isBool(val)) {
                        arr.push('bool ' + key + ";\n");
                        parseMethod.push(key + " = JSON.Bool(obj, '" + key + "');\n");
                        addTdToTable(BoolField, key);
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
        var dartCode = ["import 'dart:convert';\n"];
        dartCode.push("import 'package:football/utils/json_utils.dart';\n\n");
        var fromJsonCode = ['entity.fromObj(Map obj){\n'];
        var classCode = ['class entity {\n'];
        var fieldCode = [];
        $("#fieldTable").find("tr:not(:first)").each(function () {
            var tdArr = $(this).children();
            var j_type = tdArr.eq(0).find("span").text();
            var fieldId = tdArr.eq(0).find("span").attr('data-type-id');
            var notify = tdArr.eq(1).find("input").is(":checked");
            var fieldType = tdArr.eq(2).find("select").val();
            var fieldName = tdArr.eq(3).find("input").val();

            var originalField = getFieldOfId(fieldId);
            var selectField = getFieldOfId(fieldType);
            console.log(originalField);
            console.log(selectField);
            fieldCode.push('\t' + selectField.name + ' ' + fieldName + ';\n');
            fromJsonCode.push(generateFromJsonOfField(originalField, selectField, fieldName));
            /*console.log('j_type: '+ tdArr.eq(0).find("span").text());
            console.log('notify: ' + tdArr.eq(1).find("input").is(":checked"));
            console.log('type: ' + tdArr.eq(2).find("select").val());
            console.log('name: ' + tdArr.eq(3).find("input").val());
            console.log("=====================================");*/
        });
        fromJsonCode.push('}');
        classCode.push(fieldCode.join(""));
        classCode.push(fromJsonCode.join(""));
        classCode.push('}');
        dartCode.push(classCode.join("\n"));
        $("#result").val(dartCode.join(""));
    });

    /*var el = document.getElementById('json');
    el.addEventListener('input', function () {
        parseInput(this);
        var len = txtCount(this); //   调用函数 
    });

    el.addEventListener('propertychange', function () { //兼容IE

    });*/
}
