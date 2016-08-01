package com.onyxscheduler;

import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class CustomMailSender {

	private final Logger LOG = LoggerFactory.getLogger(CustomMailSender.class);
	
	@Value("${mail.to}")
	private String to;
		
	private final JavaMailSender mailSender;
		
		@Autowired
		public CustomMailSender(JavaMailSender javaMailSender) {
		  this.mailSender = javaMailSender;
		}

		
		public boolean sendEmail(boolean success, String jobName, String jobGroup, int trialCount, String body) {
			
			
			String sub = "";
			
			StringBuffer subBuff = new StringBuffer();
			
			if(success) {
				subBuff.append("[Job Ran Successfully] Job URL: " + jobName +", Job Group : "+ jobGroup +". Trial count: "+ trialCount);
			} else {
				subBuff.append("[Job Server Error] Job URL: " + jobName +", Job Group : "+ jobGroup +". Trial count: "+ trialCount);
			}
			
			SimpleMailMessage simpleMessage = new SimpleMailMessage();
			
			LOG.info("Sending email with sub:" + subBuff.toString());
			
			//simpleMessage.setTo(to.toArray(new String[to.size()]));
			simpleMessage.setTo(to.split(","));
			simpleMessage.setSubject(subBuff.toString());
			simpleMessage.setText(body);
			simpleMessage.setSentDate(new Date());
			try {
				mailSender.send(simpleMessage);
		} catch (Exception e) {
			
			LOG.error("Error in mail sending", e);
			
			return false;
		}
		return true;			
			
	}
}
