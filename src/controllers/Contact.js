import ContactModel from '../models/Contact';
import { validationResult } from 'express-validator/check';
import { matchedData } from 'express-validator/filter';

const Contact = {
    /**
     * 
     * @param {object} req 
     * @param {object} res
     * @returns {object} contact object 
     */
    view(req, res) {
        res.render('layouts/index', {
            section:'../contact',
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
    create(req, res) {
        console.log(req.body);
        const errors = validationResult(req)
        
        if (!errors.isEmpty()) {
            return res.render('layouts/index', {
                section:'../contact',
                data: req.body,
                errors: errors.mapped(),
                csrfToken: req.csrfToken()
            })
        }

        const data = matchedData(req)
        console.log('Sanitized: ', data)
        if (req.file) {
            console.log('Uploaded: ', req.file)
            // Homework: Upload file to S3
        }
        req.flash('success', 'Thanks for the message! I‘ll be in touch :)')
        res.redirect('/');
    },
    /**
     * 
     * @param {object} req 
     * @param {object} res 
     * @returns {object} contacts array
     */
    getAll(req, res) {
        const contacts = ContactModel.findAll();
        return res.status(200).send(contacts);
    },
    /**
     * 
     * @param {object} req 
     * @param {object} res
     * @returns {object} contact object
     */
    getOne(req, res) {
        const contact = ContactModel.findOne(req.params.id);
        if (!contact) {
            return res.status(404).send({'message': 'contact not found'});
        }
        return res.status(200).send(contact);
    },
    /**
     * 
     * @param {object} req 
     * @param {object} res 
     * @returns {object} updated contact
     */
    update(req, res) {
        const contact = ContactModel.findOne(req.params.id);
        if (!contact) {
            return res.status(404).send({'message': 'contact not found'});
        }
        const updatedContact = ContactModel.update(req.params.id, req.body)
        return res.status(200).send(updatedContact);
    },
    /**
     * 
     * @param {object} req 
     * @param {object} res 
     * @returns {void} return statuc code 204 
     */
    delete(req, res) {
        const contact = ContactModel.findOne(req.params.id);
        if (!contact) {
            return res.status(404).send({'message': 'contact not found'});
        }
        const ref = ContactModel.delete(req.params.id);
        return res.status(204).send(ref);
    }
}

export default Contact;