/**
 * ============================================================
 * GMCA Membership Portal
 * State Manager
 * ============================================================
 */

(function () {

    "use strict";

    window.GMCA = window.GMCA || {};

    GMCA.state = {

        /**
         * Wizard
         */
        currentStep: 0,

        totalSteps: 4,

        completedSteps: [],

        /**
         * Membership Application
         */
        application: {

            category_id: "",
            category_name: "",

            first_name: "",
            middle_name: "",
            last_name: "",

            gender: "",
            date_of_birth: "",

            email: "",
            phone: "",

            country: "",
            state_province: "",
            city: "",
            postal_address: "",

            church_name: "",
            ministry_name: "",
            denomination: "",
            occupation: "",

            testimony: "",
            reason_for_joining: ""

        }

    };

    /**
     * ---------------------------------------------------------
     * Wizard Methods
     * ---------------------------------------------------------
     */

    GMCA.state.getStep = function () {

        return this.currentStep;

    };

    GMCA.state.setStep = function (step) {

        this.currentStep = step;

    };

    GMCA.state.nextStep = function () {

        if (this.currentStep < this.totalSteps) {

            this.currentStep++;

        }

    };

    GMCA.state.previousStep = function () {

        if (this.currentStep > 0) {

            this.currentStep--;

        }

    };

    GMCA.state.completeStep = function (step) {

        if (!this.completedSteps.includes(step)) {

            this.completedSteps.push(step);

        }

    };

    GMCA.state.isCompleted = function (step) {

        return this.completedSteps.includes(step);

    };

    /**
     * ---------------------------------------------------------
     * Application Methods
     * ---------------------------------------------------------
     */

    GMCA.state.get = function () {

        return this.application;

    };

    GMCA.state.save = function (field, value) {

        this.application[field] = value;

    };

    GMCA.state.read = function (field) {

        return this.application[field];

    };

    GMCA.state.reset = function () {

        this.currentStep = 0;

        this.completedSteps = [];

        this.application = {

            category_id: "",
            category_name: "",

            first_name: "",
            middle_name: "",
            last_name: "",

            gender: "",
            date_of_birth: "",

            email: "",
            phone: "",

            country: "",
            state_province: "",
            city: "",
            postal_address: "",

            church_name: "",
            ministry_name: "",
            denomination: "",
            occupation: "",

            testimony: "",
            reason_for_joining: ""

        };

    };

})();