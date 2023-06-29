import {createTransport} from 'nodemailer';
import { EMAIL_PASSWORD, EMAIL_USER } from '../config';

const transporte = createTransport({
  host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_USER, 
        pass: EMAIL_PASSWORD
      }
    });

transporte.verify()
.then(()=>{
  console.log('Email verificado!');      
})

export const enviarEmail = async(para: string, mensaje: string, asunto: string)=>{
  try{
    await transporte.sendMail({
      from: `<${EMAIL_USER}>`,
      to: para,
      subject: asunto,
      html: mensaje
    });
    return true;
  } catch (error) {
    return false;      
  }
}

export const enviarEmailConArchivo = async(para: string, mensaje: string, asunto: string, files:any[])=>{
  try{
    await transporte.sendMail({
      from: `<${EMAIL_USER}>`,
      to: para,
      subject: asunto,
      html: mensaje,
      attachments:files
    });
    return true;
  } catch (error) {
    return false;      
  }
}