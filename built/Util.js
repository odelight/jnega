export class Util {
    static checkType(object, type) {
        if (object == null || !(object instanceof type)) {
            throw "Object not present or wrong type (expected type: " + type + ")";
        }
        return object;
    }
}
