/**
 * Created by sml on 2017/6/1.
 */
var _ = require('lodash');

exports.extend = function(Child, Parent) {

    var F = function(){};
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.uber = Parent.prototype;
};

exports.count = function (tiles,findVaule) {
    var reCount = 0;
    if(_.isArray(tiles))
    {
        for(var i = 0; i < tiles.length;i++)
        {
            if(tiles[i] == findVaule)
            {
                reCount += 1;
            }
        }
    }

    return reCount;
};
//合并数组
exports.arrcat = function (array1,array2)
{

    var newArray = array1;
    if(_.isArray(array1) && _.isArray(array2))
    {
        newArray = _.concat(array1,array2);
    }

    return newArray;
};
//获取数组从索引index1到index2直接的元素，返回一个新数组
exports.getArrayFromIndex2Index = function (array,index1,index2)
{
    var newArr = array;
    if(_.isArray(array) && index1 >= 0 &&  index1 <= index2 && array.length > index2)
    {
        newArr = [];
        for(var i = index1;i < index2;i++)
        {
            newArr.push(array[i]);
        }
    }

    return newArr;

};
exports.remvoeArrayFromIndex2Index = function (array,index1,index2)
{

    var cpArray = _.clone(array);

    if(_.isArray(array) && index1 >= 0 &&  index1 <= index2)
    {
        cpArray = [];
        for(var i = 0;i<array.length;i++)
        {
            if(i < index1 || i >= index2)
            {
                cpArray.push(array[i])
            }
        }
    }

    return cpArray;
};
//删除数组里面指定的元素
exports.remove = function (array,value) {

    var newArray = array;
    if(_.isArray(array))
    {
        var reIndex = -1;
        for(var i = 0;i < array.length;i++)
        {
            if(array[i] == value)
            {
                reIndex = i;
                break;
            }
        }
        if(reIndex >= 0)
        {
            newArray.splice(reIndex, 1);
        }
    }

    return newArray;
}