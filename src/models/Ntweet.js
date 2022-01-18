const { DB_NTWIEET_COLLECTION_NAME } = require('Config/DBServiceConfig');
const {v4 : uuidv4} = require('uuid');
const {dbService, storageService, authService} = require('../fbInstance');

module.exports.NtweetObject = class NtweetObject {
    constructor(Text, CreatorId, Attachment = ''){
        this.text = Text;
        this.creatorId = CreatorId;
        this.createdAt = Date.now();
        this.attachment = Attachment;
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
    getAttachment(){
        return this.attachment;
    }
    setAttachment(attachment){
        this.attachment = attachment;
    }
    getObject(){
        return {
            text : this.text,
            createdAt : this.createdAt,
            creatorId : this.creatorId,
            attachment : this.attachment,
        }
    }
    async createUserWithEmailAndPassword(email, password){
        const auth = authService.getAuth();
        await authService.createUserWithEmailAndPassword(auth, email, password);
    }
    async signInWithEmailAndPassword(email, password){
        const auth = authService.getAuth();
        await authService.signInWithEmailAndPassword(auth, email, password);
    }
    async getNweetsByUserId(userId){
        const db = dbService.getFirestore();
        const collection = dbService.collection(db, DB_NTWIEET_COLLECTION_NAME)
        const where = dbService.where("creatorId", "==", userId);
        const orderby = dbService.orderBy("createdAt", "desc");
        const query = dbService.query(collection, where, orderby);
        const querySnapshot = await dbService.getDocs(query);
        let list = [];
        await querySnapshot.forEach((doc) => {
            list.push({
                ...doc.data(),
                id : doc.id
            });
        })
        return list;
    }
    async getNweetById(ntweetId){
        const db = dbService.getFirestore();
        return await dbService.doc(db, DB_NTWIEET_COLLECTION_NAME, ntweetId);
    }
    async createtweet(nwteet){
        const db = dbService.getFirestore();
        const collection = dbService.collection(db, DB_NTWIEET_COLLECTION_NAME);
        try {
            await dbService.addDoc(collection, nwteet);
        } catch (e) {
            console.log(e);
        }
    }
    async updateNtweet(ntweet, NewNtweet){
        try {
            
            await dbService.updateDoc(ntweet, {
                text : NewNtweet.text,
                attachment : NewNtweet.attachment
            });
        } catch (error){
            console.log(error);
        }
    }
    async deleteNtweet(ntweet){
        try {
            await dbService.deleteDoc(ntweet);
        } catch (error){
            throw error;
        }
    }
    async uploadFile(file, fileData){
        let attachmentObject = {};
        
        if(!file){
            return attachmentObject;
        }
        let filename = file.name;
        let storageFilename = this.makeStorageFileName(filename);
        
        const storageFileRef = storageService.ref(storageService.getStorage(), `/images/${this.creatorId}/${storageFilename}`);
        await storageService.uploadString(storageFileRef, fileData, storageService.StringFormat.DATA_URL);
        let attachmentUrl = await storageService.getDownloadURL(storageFileRef);
        return {
            filename : storageFilename,
            attachmentUrl
        };
    }
    async deleteFile(ntweet){
        try {
            const storageFileRef = storageService.ref(storageService.getStorage(), ntweet.attachment.attachmentUrl);
            await storageService.deleteObject(storageFileRef);
            return true;
        } catch (error) {
            console.log(error);
        }
        
    }
    makeStorageFileName(filename){
        let extention = filename.substring(filename.lastIndexOf('.'), filename.length).replaceAll('.','');
        return  `${filename.substring(0, filename.lastIndexOf('.'))}_${uuidv4()}.${extention}`;
    }
    async updateProfile(updateUserObject){
        const userObject = authService.getAuth().currentUser;
        await authService.updateProfile(userObject, updateUserObject);
    }


}
