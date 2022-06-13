# Trabajo Práctico - Arquitectura Web 
### Alumna: Constanza Lusto

## Indice
1. [Descripción](#descripción)
2. [Objetivo](#objetivo)
3. [Funcionamiento](#funcionamiento)
4. [Tecnologías](#tecnologías)
5. [Arquitectura del proyecto](#arquitectura-del-proyecto)


<a name="descripción"></a>
### Descripción
Este proyecto consiste en la creacion de una API REST de reviews de restaurantes en Buenos Aires. Permite que los usuarios creen reviews con el nombre del restaurant, direccion y su opinion o review. 
<a name="objetivo"></a>
### Objetivo
El objetivo de esta pagina es proveer un espacio donde los usuarios puedan opinar sinceramente y recomendar (o no) determinados lugares con su justificacion, así como representar un lugar de búsqueda de opciones para ayudar a la toma de decisiones de quienes lean.  

<a name="funcionamiento"></a>
### Funcionamiento
La API permite la creacion de nuevos usuarios y el loggeo de los mismos. Luego, permite ver todos los restaurants creados, todos los usuarios registrados y los restaurants que creo cada usuario. A los usuarios existentes se les permite crear nuevos restaurants con su respectiva review y tambien pueden editar el titulo y la review mas tarde si asi desean.

<a name="tecnologías"></a>
### Tecnologías
Base de datos: MongoDB
Server: nodeJs con Express
Interfaz de usuario: Swagger

<a name="arquitectura-del-proyecto"></a>
### Arquitectura del proyecto
Las entidades se almacenan en la base de datos, el backend expone una API Rest para manejar las entidades User y Restaurant, con operaciones CRUD. 

