---
layout: page
label: contact
section: contact

title: Contato
permalink: /contact/
---

{% assign contacts = site.data.contacts | sort: "name" %}

{% for contact in contacts %}
- [{{ contact.name }}]({{ contact.url | relative_url }})
{% endfor %}
