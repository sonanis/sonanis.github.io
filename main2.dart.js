class TypeOfField {
    constructor(id, name, jsonName, childFieldId) {
        this.id = id;
        this.name = name;
        this.jsonName = jsonName;
        this.childFieldId = childFieldId;
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
function addTdToTable(typeOfField, fieldName, childField) {
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
    console.log('addTdToTable, ListField.id '+ListField.id+' ; '+typeOfField.id);
    if(ListField.id == typeOfField.id){
        str.push('        <span data-type-id="' + typeOfField.id + '" data-child-type-id="'+ childField.id +'">' + typeOfField.jsonName + '&lt;'+childField.name+'&gt;' + '</span>\n');
    }else{
        str.push('        <span data-type-id="' + typeOfField.id + '">' + typeOfField.jsonName + '</span>\n');
    }
    
    str.push('    </td>\n');
    str.push('    <td>\n');
    str.push('        <input type="checkbox" class="notify_check" >\n');
    str.push('    </td>\n');
    str.push('    <td>\n');
    str.push('        <select class="field_type">\n');

    AllFieldType.forEach(function (field, i) {
        if (field.id == typeOfField.id) {
            if(ListField.id == typeOfField.id){
                str.push('            <option value="' + field.id + '" selected>' + field.name + '&lt;'+childField.name+'&gt;' + '</option>\n');
            }else{
                str.push('            <option value="' + field.id + '" selected>' + field.name + '</option>\n');
            }
            
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

function generateClassField(selectFieldType, name, notify, childField){
    if(ListField.isInstantsOfId(selectFieldType.id)){
        var text = ['\tList'];
        if(childField){
            text.push('<'+childField.name+'>');
        }
        text.push(' '+name + ' = [];\n');
        return text.join("");
    }
    if(notify){
        //ValueNotifier<>
        return '\tValueNotifier<'+selectFieldType.name+'> ' + name + ';\n';
    }else{
        return '\t' + selectFieldType.name + ' ' + name + ';\n';
    }
}

function generateFromJsonOfIntField(name, notify) {
    var text = ['\t'+name+' = '];
    if(notify){
        text.push('ValueNotifier(')
    }
    text.push(' JSON.Int(obj,"' + name + '")');
    if(notify){
        text.push(');\n');
    }else{
        text.push(';\n');
    }
    return text.join("");
//    return '\t' + name + ' = JSON.Int(obj,"' + name + '");\n';
}

function generateFromJsonOfDoubleField(name, notify) {
    var text = ['\t'+name+' = '];
    if(notify){
        text.push('ValueNotifier(')
    }
    text.push(' JSON.Double(obj, "' + name + '")');
    if(notify){
        text.push(');\n');
    }else{
        text.push(';\n');
    }
    return text.join("");
//    return '\t' + name + ' = JSON.Double(obj, "' + name + '");\n'
}

function generateFromJsonOfNumField(name, notify) {
    var text = ['\t'+name+' = '];
    if(notify){
        text.push('ValueNotifier(')
    }
    text.push(' JSON.Num(obj, "' + name + '")');
    if(notify){
        text.push(');\n');
    }else{
        text.push(';\n');
    }
    return text.join("");
//    return '\t' + name + ' = JSON.Num(obj, "' + name + '");\n';
}

function generateFromJsonOfStringField(name, notify) {
    var text = ['\t'+name+' = '];
    if(notify){
        text.push('ValueNotifier(')
    }
    text.push(' JSON.string(obj, "' + name + '")');
    if(notify){
        text.push(');\n');
    }else{
        text.push(';\n');
    }
    return text.join("");
//    return '\t' + name + ' = JSON.string(obj, "' + name + '");\n';
}

function generateFromJsonOfBoolField(name, notify) {
    var text = ['\t'+name+' = '];
    if(notify){
        text.push('ValueNotifier(')
    }
    text.push(' JSON.Bool(obj, "' + name + '")');
    if(notify){
        text.push(');\n');
    }else{
        text.push(';\n');
    }
    return text.join("");
//    return '\t' + name + ' = JSON.Bool(obj, "' + name + '");\n';
}

function generateFronJsonListField(name, notify, childField){
    var text = ['\t'+name+' = [];\n'];
    text.push('\tvar array_'+name+' = obj["'+name+'"];\n');
    text.push('\tfor(int i = 0; i < array_'+name+'.length; i++){\n');
//    if(NumField.isInstantsOfId(childField.id)){
//        
//    }else if(IntField.isInstantsOfId(childField.id)){
//        
//    }else if(DoubleField.isInstantsOfId(childField.id)){
//        
//    }else if(StringField.isInstantsOfId(childField.id)){
//        
//    }
    text.push('\t\t'+name+'.add(array_'+name+'[i]);\n');
    text.push('\t}\n');
    return text.join("");
}

/*function generateToJsonOfIntField(name, notify){
    var text = ['final jsonMap = {};\n'];
    text.push("jsonMap['"+name+"'] = ");
    if(notify){
        text.push(name+'.value;\n');
    }else{
        text.push(name+';\n');
    }
    return text.join("");
}*/


function generateFromJsonOfField(originalFieldType, selectFieldType, name, notify, childField) {
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
            return generateFromJsonOfIntField(name, notify);
        } else if (selectFieldType.id == DoubleField.id) {
            return generateFromJsonOfDoubleField(name, notify);
        } else if (selectFieldType.id == NumField.id) {
            return generateFromJsonOfNumField(name, notify);
        } else if (selectFieldType.id == StringField.id) {
            return generateFromJsonOfStringField(name, notify);
        } else if (selectFieldType.id == BoolField.id) {
            return generateFromJsonOfBoolField(name, notify);
        } else if (selectFieldType.id == ListField.id){
            return generateFronJsonListField(name, notify, childField);
        }
    }
    return '';
}

function generateToJsonOfField(selectFieldType, name, notify){
    var text = [];
    text.push("\tjsonMap['"+name+"'] = ");
    if(notify){
        text.push(name+'.value;\n');
    }else{
        text.push(name+';\n');
    }
    return text.join("");
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
//        return typeof obj === 'number' && obj % 1 === 0
        if(!isNaN(obj)){
            return obj % 1 === 0;
        }
        return false;
    }
    
    function isDouble(obj){
        if(!isNaN(obj)){
            
        }
    }
    
    function isString(obj){
        return typeof (obj) == 'string';
    }

    function isBool(obj) {
        return typeof (obj) == 'boolean';
    }
    
    function isArray(obj){
        return Object.prototype.toString.call( obj ) == '[object Array]';
    }
    
    function checkListChildType(array){
        if(checknumber(array[0])){
            if(isInteger(array[0])){
                return IntField;
            }else{
                return DoubleField;
            }
        }else if(isString(array[0])){
            return StringField;
        }else if(isBool(array[0])){
            return BoolField;
        }
        return ObjectField;
    }
    
    function parseArray(array){
        if(array.length > 0){
            array.forEach(function(item, i){
                console.log(item);
            });
        }
    }

    function parseInput(el) {
        var val = el.value;
        try {
            var jsonMap = JSON.parse(val);
            for (var key in jsonMap) {
                //                console.log(key+" : "+jsonMap[key]);
                var val = jsonMap[key];
                //                console.log("val type: " + typeof (val));
                if (typeof (val) == 'object') {
                    if(isArray(val)){
//                        parseArray(val);
                        var childField = checkListChildType(val);
                        addTdToTable(ListField, key, childField);
                    }
                } else {
                    if (checknumber(val)) {
                        if (isInteger(val)) {
                            addTdToTable(IntField, key);
                        } else {
                            addTdToTable(DoubleField, key);
                        }
 
                    } else if (typeof (jsonMap[key]) == 'string') {
                        addTdToTable(StringField, key);
                    } else if (isBool(val)) {
                        addTdToTable(BoolField, key);
                    }
                }

            }

        } catch (e) {
            console.log('json格式错误');
        }
    }

    $("#generate_field").click(function () {
        clearTable();
        parseInput(document.getElementById('json'));
    });
    $("#generate_dart").click(function () {
        var entityName = $("#out_entity_name").val();
        if(!entityName){
            entityName = 'entity';
        }
        var haveNotify = false;
        var dartCode = ["import 'dart:convert';\n"];
        dartCode.push("import 'package:football/utils/json_utils.dart';\n\n");
        var fromJsonCode = [entityName+'.fromObj(Map obj){\n'];
        var toJsonCode = ['String toJson(){\n'];
        toJsonCode.push("\tfinal jsonMap = {};\n");
        var classCode = ['class '+entityName+' {\n'];
        var fieldCode = [];
        $("#fieldTable").find("tr:not(:first)").each(function () {
            var tdArr = $(this).children();
            var j_type = tdArr.eq(0).find("span").text();
            var fieldId = tdArr.eq(0).find("span").attr('data-type-id');
            var childFieldId;
            var notify = tdArr.eq(1).find("input").is(":checked");
            var fieldType = tdArr.eq(2).find("select").val();
            var fieldName = tdArr.eq(3).find("input").val();
            
            if(notify && !haveNotify){
                haveNotify = true;
                dartCode.splice(0,0,"import 'package:flutter/material.dart';\n");
            }
            if(fieldId == ListField.id){
                childFieldId = tdArr.eq(0).find("span").attr('data-child-type-id');
                console.log('childFieldId = '+childFieldId);
            }

            var originalField = getFieldOfId(fieldId);
            var selectField = getFieldOfId(fieldType);
            var childField = getFieldOfId(childFieldId);
//            console.log(originalField);
//            console.log(selectField);
//            fieldCode.push('\t' + selectField.name + ' ' + fieldName + ';\n');
            fieldCode.push(generateClassField(selectField, fieldName, notify, childField));
            fromJsonCode.push(generateFromJsonOfField(originalField, selectField, fieldName, notify, childField));
            toJsonCode.push(generateToJsonOfField(selectField, fieldName, notify, childField));
        });
        fromJsonCode.push('}');
        toJsonCode.push('\treturn json.encode(jsonMap);\n}');
        classCode.push(fieldCode.join(""));
        classCode.push(fromJsonCode.join(""));
        classCode.push(toJsonCode.join(""));
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
