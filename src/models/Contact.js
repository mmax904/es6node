import moment from 'moment';
import uuid from 'uuid';

class Contact {
    /**
     * class constructor
     * @param {object} data
     */
    constructor() {
        this.contacts = [];
    }
    /**
     * 
     * @returns {object} contact object
     */
    create(data) {
        const newContact = {
            id: uuid.v4(),
            email: data.email || '',
            message: data.message || '',
            photo: data.photo || '',
            createdDate: moment.now(),
            modifiedDate: moment.now()
        };
        this.contacts.push(newContact);
        return newContact
    }
    /**
     * 
     * @param {uuid} id
     * @returns {object} contact object
     */
    findOne(id) {
        return this.contacts.find(reflect => reflect.id === id);
    }
    /**
     * @returns {object} returns all contacts
      */
    findAll() {
        return this.contacts;
    }
    /**
     * 
     * @param {uuid} id
     * @param {object} data 
     */
    update(id, data) {
        const contact = this.findOne(id);
        const index = this.contacts.indexOf(contact);
        this.contacts[index].success = data['success'] || contact.success;
        this.contacts[index].lowPoint = data['lowPoint'] || contact.lowPoint;
        this.contacts[index].takeAway = data['takeAway'] || contact.takeAway;
        this.contacts[index].modifiedDate = moment.now()
        return this.contacts[index];
    }
    /**
     * 
     * @param {uuid} id 
     */
    delete(id) {
        const contact = this.findOne(id);
        const index = this.contacts.indexOf(contact);
        this.contacts.splice(index, 1);
        return {};
    }
}
export default new Contact();