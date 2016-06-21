/*
 * Copyright (C) 2015
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.onyxscheduler;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.actuate.autoconfigure.ManagementServerProperties;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.client.RestTemplate;

import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.builders.ResponseMessageBuilder;
import springfox.documentation.schema.ModelRef;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JSR310Module;
import static com.google.common.collect.Lists.newArrayList;

@Configuration
@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class})
@ComponentScan
@EnableSwagger2
public class OnyxSchedulerApplication {

  public static void main(String[] args) {
    SpringApplication.run(OnyxSchedulerApplication.class, args);
  }
  

  /* since there is no way to set serializationInclusion through spring boot application.yml we
  need to define a custom object mapper, and due to this all other spring boot jackson settings
  are not able to be used through application.yml
    */
  @Bean
  public MappingJackson2HttpMessageConverter jacksonConverter() {
    ObjectMapper mapper = new ObjectMapper();
    mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
    mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
    mapper.registerModule(new JSR310Module());
    return new MappingJackson2HttpMessageConverter(mapper);
  }

  @Bean
  public RestTemplate restTemplate() {
    return new RestTemplate();
  }
  	@Configuration
	@Order(ManagementServerProperties.ACCESS_OVERRIDE_ORDER)
	static class APISecurity extends WebSecurityConfigurerAdapter
	{
		@Override
		protected void configure(HttpSecurity http) throws Exception {
			
			http.csrf().disable().authorizeRequests().antMatchers(HttpMethod.OPTIONS,"/**").permitAll()//allow CORS option calls
		     .anyRequest().authenticated().and().httpBasic().realmName("Onyx Authentication");
		}
	}
  	
  	@Bean
  	public Docket jobSchedulerApi()
  	{

  			return new Docket(DocumentationType.SWAGGER_2)
  					.select()
  					.apis(RequestHandlerSelectors.basePackage("com.onyxscheduler.web.rest"))
  					.build()
  					.apiInfo(apiInfo())
  					.useDefaultResponseMessages(false)
  					.globalResponseMessage(
  							RequestMethod.GET,
  							newArrayList(
  									new ResponseMessageBuilder().code(500)
  											.message("500 message")
  											.responseModel(new ModelRef("Error"))
  											.build(), new ResponseMessageBuilder()
  											.code(403).message("Forbidden!!!!!")
  											.build()));
  	}
  		
  		private ApiInfo apiInfo() {
  			ApiInfo apiInfo = new ApiInfo("Onyx Job Scheduling Api",
  					"This api provide rest service of Onyx", "1.0", "",
  					new Contact("", "", ""),
  					"", "");
  			return apiInfo;
  		}
  		
}
