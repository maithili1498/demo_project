import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import Database from '@ioc:Adonis/Lucid/Database'
import Role from "App/Models/Role";
import { schema, rules } from '@ioc:Adonis/Core/Validator';
import Event from '@ioc:Adonis/Core/Event'


export default class AuthController {
    public async login({ request, auth }: HttpContextContract) {
        const email = request.input("email");
        const password = request.input("password");
        
        const token = await auth.use("api").attempt(email, password, {
            expiresIn: "10 days",
            });

        if(token) {
            const user = await User.findBy('email', email)
            if(user) {
                user.rememberMeToken= token.token
                user.save()
            }
        }

        // console.log(token.user.$attributes.email)
        return token.toJSON();
    }
    
    public async register({ request, auth }: HttpContextContract) {

        const userSchema = schema.create({
            username: schema.string({trim: true}, [rules.maxLength(20), rules.minLength(5), rules.unique({table:'users', column:'username'})]),
            email: schema.string({ trim: true }, [rules.unique({ table: 'users', column: 'email' }), rules.email({allowIpDomain: true, domainSpecificValidation:true})]),
            password: schema.string({}, [rules.minLength(8), rules.confirmed('confirm_password')])
        });
        const data = await request.validate({ schema: userSchema })
        console.log(data)

        const email = request.input("email");
        const password = request.input("password");
        const username = request.input('username')
        const user = new User();
        user.email = email;
        user.password = password;
        user.username = username;
        user.role_id = request.input('role_id')
        await user.save();
        
        const token = await auth.use("api").login(user, {
            expiresIn: "10 days",
        });
        
        Event.emit('new:user', user)
        return token.toJSON();
    }
}