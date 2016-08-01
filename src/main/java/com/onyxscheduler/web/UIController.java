package com.onyxscheduler.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@RequestMapping("/onyx")
@Controller
public class UIController {

	@Autowired
	private JavaMailSender javaMailSender;

	@RequestMapping(method = RequestMethod.GET)
	public String getHome() {
		return "redirect:/index.html";
	}

	@RequestMapping(value = "mail", method = RequestMethod.GET)
	public ResponseEntity<Boolean> getResponseEntity() {
		
		SimpleMailMessage mailMessage = new SimpleMailMessage();
		mailMessage.setTo("dhiren@papoye.com");
		mailMessage.setFrom("upadhyay.dhiren2@gmail.com");
		mailMessage.setSubject("Test");
		mailMessage.setText("Test mail");
		javaMailSender.send(mailMessage);
		return new ResponseEntity<Boolean>(javaMailSender == null,
				HttpStatus.OK);
	}
}
