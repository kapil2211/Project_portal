const Joi=require("joi");
module.exports.projectSchema= Joi.object(
    {
        projectName:Joi.string().required(),
        postedBy:Joi.string().required(),
        description:Joi.string().required(),
        requirements:Joi.string().required(),
        duration:Joi.number().required(),
        job_location:Joi.string().required(),
        domain:Joi.string().required(),
        skills:Joi.array().items(Joi.string()).required(),
    }).required();
