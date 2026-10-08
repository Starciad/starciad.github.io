---
layout: page
label: technologies
section: technologies

title: Tecnologias
permalink: /technologies/
---

{% assign categories = site.technologies | group_by: "category" | sort: "name" %}

{% for category in categories %}

{% assign categoryString = site.data.strings | where: "id", category.name | first %}
{% assign categoryItems = category.items | sort: "title" %}

## {{ categoryString.label }}

{% for technology in categoryItems %}
- [{{ technology.title }}]({{ technology.url | relative_url }})
{% endfor %}

{% endfor %}
