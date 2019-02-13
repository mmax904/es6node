import dbcon from '../../config/MySQL';
import moment from 'moment';
import uuid from 'uuid';

class Contact {
    /**
     * class constructor
     * @param {object} data
     */
    constructor() {
        this.table = 'contacts';
        this.contacts = [];
    }
    /**
     * 
     * @returns {object} contact object
     */
    store(data) {
        var dbval = [];
        const newContact = {
            id: uuid.v4(),
            email: data.email || '',
            message: data.message || '',
            photo: data.files.filename ? this.table+'/'+data.files.filename : '',
            created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        };

        var dbData = Object.assign({},newContact);
        dbData = Object.values(dbData);
        dbval.push(dbData);

        /** getting table fields from model */
        var db_field = Object.keys(newContact).join(',');

        var sql = `INSERT INTO ${this.table} (${db_field}) values ?`;

        var query = dbcon.query(sql, [dbval], function(err,result) {
            if (err) {
                // console.log(query.sql,'QUERY')
                // console.log(err,'ERROR');
            } else {
                // console.log('No ERROR');
            }
            //process.exit(0);
        });

        this.contacts.push(newContact);
        return newContact
    }
    /**
     * 
     * @param {uuid} id
     * @param {object} data 
     */
    update(id, data, cb) {
        const updatedContact = {
            email: data.email || '',
            message: data.message || '',
            photo: data.files.filename ? this.table+'/'+data.files.filename : '',
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        };

        var sql = `UPDATE ${this.table} SET ? WHERE id=?`;

        var query = dbcon.query(sql, [updatedContact,id], function(err,result) {
            if (err) {
                console.log(query.sql,'QUERY')
                // console.log(err,'ERROR');
            } else {
                // console.log('No ERROR');
            }
            //process.exit(0);
        });
        return updatedContact
    }
    /**
     * 
     * @param {uuid} id 
     */
    delete(id, cb) {
        var sql = `DELETE FROM ${this.table} WHERE id = ?`;
        var query = dbcon.query(sql, [id], function (err, list, fields) {
            if (err) {
                cb(false);
            } else {
                cb(true);
            }
        });        
    }
    /**
     * 
     * @param {uuid} id
     * @returns {object} contact object
     */
    findOne(id,cb) {
        var sql = `SELECT * FROM ${this.table} WHERE id=?`;
        var query = dbcon.query(sql,[id], function (err, list, fields) {
            var contact = {};
            if (err) {
                cb(contact);
            } else {
                contact = Object.assign({}, list[0]);
                cb(contact);
            }
        });
    }
    /**
     * @returns {object} returns all contacts
      */
    findAll(cb) {
        var _self = this;
        var sql = `SELECT * FROM ${this.table}`;
        var query = dbcon.query(sql, function (err, list, fields) {
            if (err) {
                cb(_self.contacts);
            } else {
                var ii = list.length;
                _self.contacts = [];
                //console.log(`Contact Data: ${JSON.stringify(list, undefined, gConfig.json_indentation)}`);
                list.forEach((v,i) => {
                    ii--;
                    v = Object.assign({}, v);
                    _self.contacts.push(v);
                });
                if(ii <= 0){
                    cb(_self.contacts);
                }
            }
        });
    }
    /*setDate() {
        this.setState({
            day : moment().date(),
            month : moment().format('MMM'),
            year : moment().year(),
            weekday : moment().format('dddd')
        });
    }*/
}
export default new Contact();