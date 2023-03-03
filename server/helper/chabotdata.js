import { chatbotRuleData } from "../models/uttarances";

let rules;
export const chatBotData = {
    setRules: async()=>{
        rules =  await chatbotRuleData.findOne().lean().exec();
        return rules
    },
    getRules:()=>{
        if(!rules){
            throw new Error("rules not found")
        }
        console.log(rules)
        return rules
    }
}