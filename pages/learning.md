---
layout: page
label: learning
section: learning

title: Aprendizagem
permalink: /learning/
---

{% assign categories = site.learning | group_by: "category" | sort: "name" %}

{% for category in categories %}

{% assign categoryString = category.name %}
{% assign categoryItems = category.items | sort: "title" %}

## {{ categoryString }}

{% for item in categoryItems %}
- [{{ item.title }}]({{ item.url | relative_url }})
{% endfor %}

{% endfor %}
