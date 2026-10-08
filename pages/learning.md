---
layout: page
label: learning
section: learning

title: Aprendizagem
permalink: /learning/
---

{% assign categories = site.learning | group_by: "category" | sort: "name" %}

{% for category in categories %}

{% assign categoryString = site.data.strings | where: "id", category.name | first %}
{% assign categoryItems = category.items | sort: "title" %}

## {{ categoryString.label }}

{% for item in categoryItems %}
- [{{ item.title }}]({{ item.url | relative_url }})
{% endfor %}

{% endfor %}
