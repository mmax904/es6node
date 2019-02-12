import ContactModel from '../models/Contact';
import { validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';

const Contact = {
    /**
     * 
     * @param {object} req 
     * @param {object} res 
     * @returns {object} contacts array
     */
    view: async function (req, res) {
        ContactModel.findAll(function(contacts) {
            return res.render('layouts/index', {
                section:'../contacts/list',
                data: contacts,
                csrfToken: req.csrfToken()
            });
        });
    },
    /**
     * 
     * @param {object} req 
     * @param {object} res
     * @returns {object} contact object 
     */
    create(req, res) {
        res.render('layouts/index', {
            section:'../contacts/add',
            data: {},
            errors: {},
            csrfToken: req.csrfToken()
        });
    },
    /**
     * 
     * @param {object} req 
     * @param {object} res
     * @returns {object} contact object 
     */
    store(req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.render('layouts/index', {
                section:'../contacts/add',
                data: req.body,
                errors: errors.mapped(),
                csrfToken: req.csrfToken()
            })
        }

        const data = matchedData(req)
        data.files = {};
        if (req.file) {
            data.files = req.file;
        }
        var newContact = ContactModel.store(data);
        req.flash('success', 'Thanks for the message! I‘ll be in touch :)')
        res.redirect('/contact');
    },
    /**
     * 
     * @param {object} req 
     * @param {object} res
     * @returns {object} contact object
     */
    edit(req, res) {
        ContactModel.findOne(req.params.id,function(contact) {
            if (!contact.id) {
                return res.status(404).send({'message': 'contact not found'});
            }
            return res.render('layouts/index', {
                section:'../contacts/edit',
                data: contact,
                errors: [],
                csrfToken: req.csrfToken()
            })
        });
    },
    /**
     * 
     * @param {object} req 
     * @param {object} res 
     * @returns {object} updated contact
     */
    update(req, res) {
        const errors = validationResult(req)
        
        if (!errors.isEmpty()) {
            return res.render('layouts/index', {
                section:'../contacts/edit',
                data: req.body,
                errors: errors.mapped(),
                csrfToken: req.csrfToken()
            })
        }

        const data = matchedData(req)
        data.files = {};
        if (req.file) {
            //console.log('Uploaded: ', req.file)
            // here can Upload file to S3
            data.files = req.file;
        }
        //console.log('Sanitized: ', data)
        var updatedContact = ContactModel.update(req.params.id,data,true);
        req.flash('success', 'Thanks for the message! I‘ll be in touch :)')
        res.redirect('/contact');
    },
    /**
     * 
     * @param {object} req 
     * @param {object} res 
     * @returns {void} return statuc code 204 
     */
    delete(req, res) {
        //res.redirect(req.get('referer'));
        ContactModel.delete(req.params.id,function(contact) {
            if (!contact) {
                return res.status(404).send({'message': 'contact not found'});
            }
            res.redirect('/contact');
        });
    }
}

export default Contact;