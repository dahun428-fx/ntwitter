class NtweetObject {

    constructor(Text, CreatorId){
        this.text = Text;
        this.creatorId = CreatorId;
        this.createdAt = Date.now();
    }
    getText(){
        return this.text;
    }
    setText(text){
        this.text = text;
    }
    getCreatorId(){
        return this.creatorId;
    }
    setCreatorId(creatorId){
        this.creatorId = creatorId;
    }
    getCreatedAt(){
        return this.createdAt;
    }
    setCreatedAt(createdAt){
        this.createdAt = createdAt;
    }
    getObject(){
        return {
            text : this.text,
            createdAt : this.createdAt,
            creatorId : this.creatorId,
        }
    }
}
module.exports.NtweetObject = NtweetObject;