
<%--

 Copyright 2012 IMOS

 The AODN/IMOS Portal is distributed under the terms of the GNU General Public License

--%>



<%@ page import="au.org.emii.portal.Motd" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'motd.label', default: 'Motd')}" />
        <title><g:message code="default.create.label" args="[entityName]" /></title>
    </head>
    <body>
        <div class="nav">
          <div id="logo"></div>
            <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
            <span class="menuButton"><g:link class="list" action="list"><g:message code="default.list.label" args="[entityName]" /></g:link></span>
        </div>
        <div class="body">
            <h1><g:message code="default.create.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <g:hasErrors bean="${motdInstance}">
            <div class="errors">
                <g:renderErrors bean="${motdInstance}" as="list" />
            </div>
            </g:hasErrors>
            <g:form action="save" >
                <div class="dialog">
                    <table>
                        <tbody>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="motdTitle"><g:message code="motd.motdTitle.label" default="Motd Title" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: motdInstance, field: 'motdTitle', 'errors')}">
                                    <g:textField name="motdTitle" value="${motdInstance?.motdTitle}" />
                                </td>
                            </tr>
                            
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="motd"><g:message code="motd.motd.label" default="Motd" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: motdInstance, field: 'motd', 'errors')}">
                                    <g:textArea  rows="5" cols="40" name="motd" value="${motdInstance?.motd}" />
                                </td>
                            </tr>
                        
                        
                        </tbody>
                    </table>
                </div>
                <div class="buttons">
                    <span class="button"><g:submitButton name="create" class="save" value="${message(code: 'default.button.create.label', default: 'Create')}" /></span>
                </div>
            </g:form>
        </div>
    </body>
</html>
