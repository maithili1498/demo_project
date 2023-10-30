import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Profile from "App/Models/Profile";
import Role from "App/Models/Role";
import User from "App/Models/User";

export default class ProfilesController {

    public async index({ request, auth}: HttpContextContract)
    {
        console.log('abcbccccc')
        const page = request.input('page', 1)
        const users = await User.query().preload('profile').paginate(page, 3)
        return users
    }
    
    public async show({ request, auth, params}: HttpContextContract)
    {
        try {
            console.log(params, 'abbcccc')
            const user = await auth.authenticate()            
            await user.load('profile');
            return user;
            
        } catch (error) {
        	console.log(error)
        }
    }
    
    public async update({ auth, request, params}: HttpContextContract)
    {
        const profile = await Profile.find(params.id);
        if (profile) {
            profile.first_name = request.input('first_name');
            profile.last_name = request.input('last_name');
            profile.dob = request.input('dob');
            profile.role = request.input('role');
            
            if (await profile.save()) {
            	return profile
        	}
        	return;
        }
        return;
    }
    
    public async store({ auth, request, response}: HttpContextContract)
    {
        const user = await auth.authenticate();
        console.log(user)
        const profile = new Profile();
        profile.user_id = user.$attributes.id
        profile.first_name = request.input('first_name');
        profile.last_name = request.input('last_name');
        profile.dob = request.input('dob');
        profile.role = request.input('role');
        await profile.save()
        return profile
    }
    
    public async destroy({response, auth, request, params}: HttpContextContract)
    {
        const user = await auth.authenticate();
        const profile = await Profile.query().where('id', request.input('id')).delete();
        return response.json({message:"Deleted successfully"})
    }
}