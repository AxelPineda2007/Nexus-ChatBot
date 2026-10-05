import { OfficialDocument, DocumentChunk } from '../types';

export const INDEL_DOCUMENTS: OfficialDocument[] = [
  {
    id: 'doc-normativa-estudiantes-indel',
    code: 'DOC-EST-01',
    title: 'Normativa para Estudiantes: Deberes, Obligaciones y Derechos',
    category: 'reglamento',
    badgeColor: 'emerald',
    effectiveDate: 'Vigente 2026',
    version: 'Normativa Oficial Estudiantil INDEL',
    authority: 'Instituto Nacional Cantón Lourdes (INDEL) • 6.ª Av. Sur Col. Las Arboledas, Lourdes Colón',
    description: 'Deberes u obligaciones estudiantiles (31 numerales), derechos institucionales, uniforme diario y deportivo, presentación personal, bolsón transparente y tecnología.',
    sections: [
      {
        title: 'Sección I: Derechos de los Estudiantes',
        articles: [
          {
            id: 'est-derechos',
            articleNumber: 'Derechos',
            title: 'Derechos Fundamentales del Estudiante INDEL',
            content: '1. Ser tratado con respeto.\n2. Garantizar su desarrollo integral.\n3. Participar en los diferentes clubes de la institución.\n4. A recibir educación de forma gratuita.',
            keywords: ['derechos', 'respeto', 'desarrollo integral', 'clubes', 'gratuita']
          }
        ]
      },
      {
        title: 'Sección II: Deberes u Obligaciones Estudiantiles (Numerales 1 al 10: Asistencia y Uniformes)',
        articles: [
          {
            id: 'est-deb-1-8',
            articleNumber: 'Num. 1-8',
            title: 'Ingreso, Uniforme Diario, Calzado e Identificación',
            content: '1. Ingreso a la institución 15 minutos antes del toque en jornada matutina y vespertina.\n2. Portar Uniforme diario. NO MODIFICARLO.\n3. USO DE CALCETAS BLANCAS EN SRITAS, NO PUNTERAS.\n4. USO DE CALCETINES NEGROS EN JÓVENES, NO PUNTERAS.\n5. Uso de zapatos negros limpios y lustrados.\n6. Cincho negro de cuero, hebilla con pasador.\n7. Uso de monograma cosido en bolsa izquierda.\n8. Portar Identificador por especialidad.',
            keywords: ['ingreso 15 minutos', 'uniforme diario', 'calcetas blancas', 'calcetines negros', 'no punteras', 'zapatos negros', 'cincho negro', 'monograma', 'identificador']
          },
          {
            id: 'est-deb-9-10',
            articleNumber: 'Num. 9-10',
            title: 'Uniforme Deportivo y Calzado de Educación Física',
            content: '9. USO DE UNIFORME DEPORTIVO, permitido únicamente el día que corresponde educación física (Pants color azul, camisa blanca sin estampadas. Se contratará proveedor).\n10. Portar tenis limpios, sin cintas XL. Estos deberán utilizarse únicamente el día correspondiente a la clase de Educación Física.',
            keywords: ['uniforme deportivo', 'pants azul', 'camisa blanca no estampadas', 'tenis limpios', 'sin cintas xl', 'educacion fisica']
          }
        ]
      },
      {
        title: 'Sección III: Deberes sobre Presentación Personal, Cabello y Accesorios (Numerales 11 al 20)',
        articles: [
          {
            id: 'est-deb-11-20',
            articleNumber: 'Num. 11-20',
            title: 'Corte Francesa Oscura, Vello Facial, Uñas, Cejas y Cosméticos',
            content: '11. Corte de cabello francesa oscura para varones (no cortes de moda).\n12. Cejas sin CORTE y sin tatuaje en señoritas y jóvenes.\n13. Presentarse sin Vello facial (Barba y Bigote).\n14. Uso de aretes pequeños.\n15. Uñas en señoritas sin colores, solo brillo.\n16. No usar uñas acrílicas señoritas.\n17. Uso de uñas largas en jóvenes no permitido.\n18. Uso de aretes caballeros no permitido.\n19. No permitido el uso de maquillaje en señoritas y jóvenes.\n20. Cabello tinturado señoritas y jóvenes no permitido.',
            keywords: ['francesa oscura', 'no cortes de moda', 'cejas sin corte', 'sin vello facial', 'barba y bigote', 'aretes pequeños', 'sin uñas acrilicas', 'uñas largas', 'aretes caballeros no', 'sin maquillaje', 'sin tinte', 'cabello tinturado']
          }
        ]
      },
      {
        title: 'Sección IV: Convivencia, Tecnología, Talleres y Bolsón Transparente (Numerales 21 al 31)',
        articles: [
          {
            id: 'est-deb-21-26',
            articleNumber: 'Num. 21-26',
            title: 'Uso de Celulares, Chicle, Accesorios y Aseo Personal',
            content: '21. No está permitido el uso de CELULAR ni audífonos en horas de clases, recesos y horas libres. Excepto asignaturas que lo requieran.\n22. Respetar el toque de entrada a salón de clases.\n23. Evitar masticar chicle dentro de la institución.\n24. No usar accesorios personales, tales como collares, cadenas, piercing y similares.\n25. Portar kit de limpieza personal.\n26. Aseo personal diario (baño, desodorante).',
            keywords: ['celular prohibido', 'audifonos prohibidos', 'recesos', 'toque de entrada', 'chicle prohibido', 'piercing prohibido', 'collares cadenas', 'kit de limpieza', 'aseo personal']
          },
          {
            id: 'est-deb-27-31',
            articleNumber: 'Num. 27-31',
            title: 'Uso de Gabacha, Talleres, Equipos Tecnológicos y Bolsón Transparente',
            content: '27. Uso de gabacha LIMPIA, debe permanecer debidamente doblada y ordenada dentro del bolsón. Uso exclusivo para taller y actividades extracurriculares de la institución.\n28. Mantener el orden y limpieza en la zona de taller.\n29. Es de uso obligatorio portar los recursos tecnológicos necesarios, tales como USB, calculadora, laptop, cargador para laptop, entre otros, según lo requiera cada módulo o asignatura.\n30. Cumplir con el horario establecido para la limpieza del aula durante el recreo y a la hora de salida.\n31. Portar bolsón y estuche TRANSPARENTE. NO DE COLOR.\n\nNOTA IMPORTANTE:\n1. Todo estudiante que quiera pertenecer a actividades extracurriculares deportiva o artística debe cumplir con todos los deberes antes mencionados.\n2. Pasar todas materias y módulos en cada uno de los periodos correspondientes, de lo contrario se suspenderá participación hasta nivelar procesos académicos pendientes.',
            keywords: ['gabacha limpia', 'taller orden', 'recursos tecnologicos', 'laptop usb cargador', 'limpieza del aula', 'bolson transparente', 'estuche transparente no de color', 'actividades extracurriculares']
          }
        ]
      }
    ]
  },
  {
    id: 'doc-demeritos-faltas-sanciones-indel',
    code: 'DOC-DISC-02',
    title: 'Clasificación de Faltas, Deméritos, Sanciones y Actas de Compromiso',
    category: 'reglamento',
    badgeColor: 'rose',
    effectiveDate: 'Vigente 2026',
    version: 'Régimen Disciplinario Oficial INDEL',
    authority: 'Coordinación de Disciplina y Dirección INDEL',
    description: 'Catálogo exhaustivo de 27 Faltas Leves, Faltas Graves, Faltas Muy Graves, escala sancionatoria (Drive, Disciplina Positiva, Memorándum/Acta Compromiso, PNC, CONAPINA).',
    sections: [
      {
        title: 'Sección I: Faltas Leves (Catálogo de 27 Infracciones)',
        articles: [
          {
            id: 'faltas-leves-1-10',
            articleNumber: 'Leves 1-10',
            title: 'Faltas Leves: Horarios, Almuerzo, Accesorios y Suéteres',
            content: 'Definición: Actitudes y comportamientos que alteren la convivencia, pero que no involucren daño físico o psicológico a otros integrantes de la comunidad.\n' +
              '1. No presentarse en horario establecido para el ingreso a la institución en jornada matutino y vespertino.\n' +
              '2. Ingreso de ALIMENTOS en horas de ALMUERZO (solo se permitirá alimentos elaborados en casa, por parte de referentes de familia).\n' +
              '3. Uso de GORRAS, GORROS, PAÑOLETAS u OTROS accesorios.\n' +
              '4. No portar uniforme correctamente (numerales 3,4,5,6,7,8).\n' +
              '5. No seguir indicaciones de corte de cabello francesa oscura para varones (no cortes de moda).\n' +
              '6. Cejas con CORTE o TATUADAS en señoritas y jóvenes.\n' +
              '7. Usar suéter de colores oscuros, holgados y sudaderas.\n' +
              '8. Portar suéter después de las 8:30 am.\n' +
              '9. Usar Piercing en oreja, nariz, lengua, barbilla y cejas.\n' +
              '10. Usar aritos de colgar grandes para señoritas.',
            keywords: ['faltas leves', 'almuerzo comida casera', 'gorras pañoletas', 'sueter oscuro sudaderas', 'sueter despues de las 8:30 am', 'piercing oreja nariz', 'aritos grandes']
          },
          {
            id: 'faltas-leves-11-20',
            articleNumber: 'Leves 11-20',
            title: 'Faltas Leves: Aretes, Uñas, Celulares, Bebidas y Cintas XL',
            content: '11. Uso de Aretes para caballeros.\n' +
              '12. Uso de uñas acrílicas en señoritas y uñas largas en jóvenes.\n' +
              '13. Uso de maquillaje en señoritas y jóvenes.\n' +
              '14. Uso de tinte en cabello en señoritas y jóvenes.\n' +
              '15. Irrespetar el toque de entrada a salón de clases.\n' +
              '16. Uso de CELULAR, audífonos en horas de clases, recesos y horas libres no es permitido. Excepto asignaturas que lo requieran.\n' +
              '17. Ingresar chicle a la institución.\n' +
              '18. Ingresar bebidas carbonatadas, energizantes y jugos a la institución.\n' +
              '19. Uso de cintas XL en zapatos deportivos.\n' +
              '20. Portar el uniforme deportivo cuando no corresponde a la clase de educación física.',
            keywords: ['aretes caballeros', 'uñas acrilicas', 'maquillaje', 'tinte cabello', 'celular recesos', 'ingresar chicle', 'bebidas carbonatadas energizantes jugos', 'cintas xl', 'uniforme deportivo dia incorrecto']
          },
          {
            id: 'faltas-leves-21-27',
            articleNumber: 'Leves 21-27',
            title: 'Faltas Leves: Gabacha, Taller, Salida sin Autorización y Vello Facial',
            content: '21. Portar la gabacha en horas no correspondientes de su horario de tecnología.\n' +
              '22. No mantener su espacio de trabajo limpio y organizado (zona de taller).\n' +
              '23. No portar sus materiales educativos y tecnológicos para el desarrollo de sus clases.\n' +
              '24. No cumplir con su horario de aseo asignado.\n' +
              '25. Ingresar alimentos y bebidas al salón de clases y talleres.\n' +
              '26. Retirarse de la institución sin autorización o con el grado que no le corresponde.\n' +
              '27. Presentarse a la institución con vello facial.',
            keywords: ['gabacha horario incorrecto', 'taller sucio', 'materiales tecnologicos olvidados', 'aseo asignado', 'alimentos salon clases', 'retirarse sin autorizacion', 'vello facial barba']
          }
        ]
      },
      {
        title: 'Sección II: Faltas Graves y Faltas Muy Graves',
        articles: [
          {
            id: 'faltas-graves',
            articleNumber: 'Faltas Graves',
            title: 'Faltas Graves: Vocabulario, Escándalo y Escenas Amorosas',
            content: 'Definición: Actitudes y comportamientos que atenten contra la integridad psicológica de personas con las que establece relaciones cotidianas en el centro educativo o afecta el bien común. Ejemplos: agresiones, intimidaciones, entre otros.\n' +
              '1. Vocabulario soez. Se pide respeto a miembros de Comunidad Educativa.\n' +
              '2. Gritos y escándalo en Fotocopiadora, cafetería, pasillos. Irrespeto a miembros de la Comunidad Educativa.\n' +
              '3. Escenas amorosas dentro y fuera del instituto. Respeto a los miembros de Comunidad Educativa.',
            keywords: ['faltas graves', 'vocabulario soez', 'gritos escandalo pasillos fotocopiadora', 'escenas amorosas dentro y fuera', 'respeto']
          },
          {
            id: 'faltas-muy-graves',
            articleNumber: 'Faltas Muy Graves',
            title: 'Faltas Muy Graves: Armas, Drogas, Bullying, Riñas y Daños',
            content: 'Definición: Actitudes y comportamientos que atenten contra la integridad física y psicológica, así como agresiones sostenidas en el tiempo, incluye conductas tipificadas como delito (robos, acoso o abuso sexual, tráfico de drogas, acoso escolar).\n' +
              '1. Realizar bromas o juegos bruscos que atenten contra la integridad física de la persona.\n' +
              '2. Ingresar objetos sin fines didácticos (cutter, navajas, tijeras con punta, objetos cortopunzantes).\n' +
              '3. Consumo, distribución de droga, Alcohol y Cigarros (se reportará a Instancias correspondientes PNC).\n' +
              '4. BULLYING y sus derivados (será reportado a instancias correspondientes PNC).\n' +
              '5. Hurto y robo dentro de la institución.\n' +
              '6. Realizar actos de acoso y abuso sexual.\n' +
              '7. Realizar actos de intimidación, maltrato y discriminación.\n' +
              '8. Generar riñas.\n' +
              '9. Dañar intencionalmente el mobiliario de la institución.\n' +
              '10. Hacer uso inadecuado de servicios sanitarios. De lo contrario todo daño será reparado por referentes de familia.',
            keywords: ['faltas muy graves', 'juegos bruscos', 'cutter navajas cortopunzantes', 'drogas alcohol cigarros pnc', 'bullying pnc', 'hurto robo', 'acoso sexual', 'riñas peleas', 'daño mobiliario sanitarios']
          }
        ]
      },
      {
        title: 'Sección III: Régimen de Sanciones, Deméritos, Memorándum y Actas Compromiso',
        articles: [
          {
            id: 'sanciones-leves-graves',
            articleNumber: 'Sanciones',
            title: 'Sanciones por Faltas Leves, Graves y Conversión de 3 Faltas Verbales',
            content: 'SANCIONES POR FALTAS LEVES:\n' +
              '1. En primera instancia se le hará un llamado de atención verbal, el cual será registrado en Drive.\n' +
              '2. El segundo llamado de atención se registrará en el expediente del estudiante y se asignará acciones de disciplina positiva.\n\n' +
              'SANCIONES POR FALTAS GRAVES (Y REGLA DEL TERCER LLAMADO):\n' +
              '1. ¡EL TERCER LLAMADO DE ATENCIÓN VERBAL SE CONVIERTE EN FALTA GRAVE! Se elaborará ACTA COMPROMISO / MEMORÁNDUM DISCIPLINARIO, firmada por estudiante y referente de familia. Además se asignará acciones de disciplina positiva de acuerdo a la falta cometida.\n' +
              '2. Amonestación escrita y realización de trabajo comunitario que no interrumpa su horario de clases.\n' +
              '3. En la reincidencia de faltas graves se les suspenderá de clases presenciales, garantizando su proceso académico multimodal.\n' +
              '4. Suspensión parcial de actividades institucionales y extracurriculares.',
            keywords: ['sanciones faltas leves', 'primer llamado drive', 'segundo llamado expediente disciplina positiva', 'tercer llamado falta grave', 'acta compromiso', 'memorandum', 'trabajo comunitario', 'suspension presencial multimodal']
          },
          {
            id: 'sanciones-muy-graves-instancias',
            articleNumber: 'Sanciones Muy Graves',
            title: 'Sanciones por Faltas Muy Graves y Remisión a Instancias (PNC, CONAPINA, Fiscalía)',
            content: 'SANCIONES POR FALTAS MUY GRAVES:\n' +
              '1. De existir daños a terceros, los gastos en los que se incurran serán costeados por el agresor.\n' +
              '2. De tener incidencia en faltas muy graves se le condiciona la matrícula para el siguiente año escolar.\n\n' +
              'ACCIONES A REALIZAR:\n' +
              'Informar a Instancias correspondientes según el caso:\n' +
              '• CONAPINA (Consejo Nacional de la Primera Infancia, Niñez y Adolescencia)\n' +
              '• PNC (Policía Nacional Civil)\n' +
              '• Fiscalía General de la República\n' +
              '• ISDEMU\n' +
              '• Unidad de Salud.',
            keywords: ['gastos pagados por agresor', 'matricula condicionada', 'conapina', 'pnc', 'fiscalia', 'isdemu', 'unidad de salud']
          }
        ]
      }
    ]
  },
  {
    id: 'doc-normativa-referentes-familia',
    code: 'DOC-PADRES-03',
    title: 'Normativa para Referentes de Familia (Artículo 55 Ley Crecer Juntos)',
    category: 'institucional',
    badgeColor: 'purple',
    effectiveDate: 'Vigente 2026',
    version: 'Normativa Institucional de Madres, Padres y Responsables',
    authority: 'Dirección INDEL y Ley Crecer Juntos Art. 55',
    description: 'Obligaciones de padres, vestimenta decorosa al visitar el plantel, horarios de atención, justificación de inasistencias y reportes.',
    sections: [
      {
        title: 'Sección I: Responsabilidades y Presentación Personal Decorosa',
        articles: [
          {
            id: 'padres-art-55',
            articleNumber: 'Art. 55',
            title: 'Obligaciones de Referentes de Familia y Código de Vestimenta',
            content: 'Es responsabilidad de las madres, padres, representantes y responsables de las niñas, niños y adolescentes:\n' +
              '• Matricular oportunamente y verificar la asistencia regular.\n' +
              '• Garantizar que su hijo/a ingrese 15 minutos antes de la hora establecida.\n' +
              '• Verificar la correcta presentación personal del estudiante al salir de su casa hacia la institución.\n' +
              '• Presentación personal de forma decorosa de los referentes al ingresar al instituto (PROHIBIDO: short, minifalda, licras y top).\n' +
              '• Conocer horarios de entrada, salida, sección y docente coordinador de sus hijos.\n' +
              '• Referentes que queden reportados en expediente de estudiante deben residir en el país.\n' +
              '• Comportamiento decoroso obligatorio. El irrespeto a personal docente y administrativo dará lugar a levantar ACTA.',
            keywords: ['ley crecer juntos art 55', 'padres de familia', 'ingreso 15 minutos antes', 'vestimenta decorosa padres', 'prohibido short minifalda licras top', 'acta por irrespeto']
          },
          {
            id: 'padres-inasistencias-atencion',
            articleNumber: 'Inasistencias & Horarios',
            title: 'Protocolo de Inasistencias y Horarios de Atención a Padres',
            content: '• Reportar INASISTENCIA a través del link el mismo día que el estudiante presente ausencia; de lo contrario no se tomará en cuenta.\n' +
              '• Reportar INASISTENCIA DE MÁS DE UN DÍA por escrito únicamente en los siguientes casos: 1. Duelo, 2. Enfermedad con Certificación Médica, 3. Participación en Clubes deportivos, 4. Becas, 5. Otros.\n' +
              '• Los padres deberán reportar por escrito y en formato institucional cuando el estudiante no se presente con su uniforme completo, limpio y ordenado o presente problemas con zapatos.\n' +
              '• Consultas a personal docente en horario laboral al número telefónico: 23384571.\n' +
              '  Horario de atención: 7:00 am a 12:00 m y de 1:00 pm a 4:00 pm.\n' +
              '• Acto de Graduación: Los estudiantes se presentan según Orientaciones Ministeriales.',
            keywords: ['reportar inasistencia link', 'inasistencia mas de un dia por escrito', 'certificacion medica duelo', 'justificacion formato institucional', 'horario atencion 23384571', '7:00 am 12:00 m 1:00 pm 4:00 pm']
          }
        ]
      }
    ]
  },
  {
    id: 'doc-normativa-docentes-lcd',
    code: 'DOC-DOC-04',
    title: 'Normativa, Infracciones y Sanciones para Personal Docente (Ley de la Carrera Docente)',
    category: 'evaluacion',
    badgeColor: 'amber',
    effectiveDate: 'Vigente 2026',
    version: 'Ley de la Carrera Docente (LCD) y RLCD',
    authority: 'Ministerio de Educación, Ciencia y Tecnología (MINEDUCYT) / CDE INDEL',
    description: 'Obligaciones docentes (LCD Art. 31), prohibiciones (Art. 32), faltas menos graves, graves y muy graves (Arts. 53-56), sanciones (amonestación, suspensión, despido e inhabilitación Arts. 57-64).',
    sections: [
      {
        title: 'Sección I: Obligaciones y Prohibiciones a los Educadores (LCD Arts. 31 y 32)',
        articles: [
          {
            id: 'doc-obligaciones',
            articleNumber: 'LCD Art. 31',
            title: 'Obligaciones Principales de los Docentes',
            content: '1. Asistir puntualmente: Presentarse 15 minutos antes de iniciar sus labores para preparar materiales y aula (RLCD Art. 38, a).\n' +
              '2. Desarrollar la clase con puntualidad en el tiempo programado.\n' +
              '3. Firmar el Libro de Asistencia al llegar y salir (RLCD Art. 38, d).\n' +
              '4. Cuidar su presentación personal acorde a su profesión (RLCD Art. 38, ll).\n' +
              '5. Desempeñar el cargo con diligencia y eficiencia.\n' +
              '6. Planificar labor docente y elaborar material didáctico colaborativo.\n' +
              '7. Guardar respeto a superiores, alumnos, padres y compañeros; evitar bromas bruscas.\n' +
              '8. Denunciar cualquier hecho de violencia sexual.\n' +
              '9. Llevar completos y al día los libros del registro escolar y Portafolio físico y digital.\n' +
              '10. Asistir a capacitaciones y cumplir acuerdos del Consejo de Profesores.',
            keywords: ['obligaciones docentes', 'lcd art 31', '15 minutos antes', 'firmar libro asistencia', 'portafolio docente', 'denunciar violencia sexual']
          },
          {
            id: 'doc-prohibiciones',
            articleNumber: 'LCD Art. 32',
            title: 'Prohibiciones Expresas a los Docentes',
            content: 'Se prohíbe a los educadores:\n' +
              '1) Abandonar labores durante la jornada sin justa causa.\n' +
              '2) Realizar propaganda política partidista o religiosa en el centro.\n' +
              '3) Portar armas de cualquier clase durante sus labores.\n' +
              '4) Cometer cualquier forma de maltrato físico, psíquico o sexual contra alumnos u otros miembros.\n' +
              '5) Tomar represalias por filiación política o gremial.\n' +
              '6) Coartar la libre asociación.\n' +
              '7) Efectuar colectas obligatorias o exigir pronunciamientos.\n' +
              '8) Usar el local para vivienda sin autorización.\n' +
              '9) Cobrar cuotas sociales o vender mercaderías en beneficio propio.',
            keywords: ['prohibiciones docentes', 'lcd art 32', 'abandonar labores', 'propaganda politica', 'armas prohibidas', 'maltrato prohibido', 'colectas prohibidas', 'vender mercaderia beneficio propio']
          }
        ]
      },
      {
        title: 'Sección II: Infracciones Docentes: Menos Graves, Graves y Muy Graves (Arts. 53-56)',
        articles: [
          {
            id: 'doc-infracciones',
            articleNumber: 'LCD Arts. 54-56',
            title: 'Clasificación de Faltas Menos Graves, Graves y Muy Graves de Docentes',
            content: '• FALTAS MENOS GRAVES (Art. 54): Uso indebido de materiales del centro, negligencia e impuntualidad, propaganda que entorpezca labores, fumar mientras imparte clases.\n' +
              '• FALTAS GRAVES (Art. 54): Perturbar normal desarrollo de labores, desobedecer a superiores en forma manifiesta, expresiones irrespetuosas a superiores, alumnos o padres, faltar a labores sin permiso sin causa justificada, ostentar distintivos de partidos políticos, laborar en otro centro en jornada oficial, reincidencia en falta menos grave.\n' +
              '• FALTAS MUY GRAVES (Art. 56): Ingerir bebidas embriagantes o drogas en el centro o presentarse bajo sus efectos, abandonar labores sin permiso de Directora o Subdirectora, poner en peligro la seguridad de alumnos, exigir o recibir dádivas/sobornos por notas o nombramientos, alterar o destruir registros escolares con datos falsos, acosar sexualmente o cometer actos contra la libertad sexual, aplicar maltrato físico o psíquico, exigir cuotas de matrícula o escolaridad.',
            keywords: ['faltas menos graves docentes art 54', 'faltas graves docentes art 54', 'faltas muy graves docentes art 56', 'ebriedad drogas docentes', 'dadivas sobornos notas', 'alterar registros escolares', 'acoso sexual docentes']
          }
        ]
      },
      {
        title: 'Sección III: Sanciones Docentes: Amonestación, Suspensión, Despido e Inhabilitación (Arts. 57-64)',
        articles: [
          {
            id: 'doc-sanciones-tipos',
            articleNumber: 'LCD Arts. 57-64',
            title: 'Clases de Sanciones Disciplinarias a Docentes',
            content: '1. AMONESTACIÓN ESCRITA (Art. 58): Aplicada en faltas menos graves.\n' +
              '2. SUSPENSIÓN SIN GOCE DE SUELDO (Art. 59): De 3 a 30 días para faltas graves, y de 30 a 60 días para faltas muy graves.\n' +
              '3. SUSPENSIÓN PREVIA INMEDIATA (Art. 60): Por flagrancia en falta muy grave (drogas, armas, registros falsos), arresto, o por acoso sexual denunciado ante Junta de la Carrera Docente y Fiscalía dentro de los 5 días hábiles.\n' +
              '4. DESPIDO (Art. 61): Por reincidencia en falta muy grave, por condena de delito, inasistencia injustificada durante 8 días consecutivos o 10 días hábiles no consecutivos en un mes, o por acoso sexual comprobado en primera instancia.\n' +
              '5. INHABILITACIÓN PERMANENTE PARA LA DOCENCIA (Arts. 62, 63 y 64): Prohibición de ejercer en instituciones públicas y privadas cuando constituya grave riesgo o indignidad, impuesta de oficio ante acoso sexual (Art. 56 num 19).',
            keywords: ['amonestacion escrita art 58', 'suspension sin goce de sueldo 3 a 30 dias', '30 a 60 dias muy graves', 'suspension previa art 60', 'despido art 61', 'inasistencia 8 dias consecutivos 10 no consecutivos', 'inhabilitacion permanente docencia art 62 63 64']
          }
        ]
      }
    ]
  },
  {
    id: 'doc-normativa-administrativo',
    code: 'DOC-ADM-05',
    title: 'Normativa para Personal Administrativo y de Servicio INDEL',
    category: 'institucional',
    badgeColor: 'blue',
    effectiveDate: 'Vigente 2026',
    version: 'Normativa de Servicio Civil y Ética',
    authority: 'Ley del Servicio Civil, Ley de Ética Gubernamental y Código de Trabajo',
    description: 'Derechos y obligaciones laborales del personal administrativo, resguardo de patrimonio, confidencialidad y rechazo de dádivas/sobornos.',
    sections: [
      {
        title: 'Sección I: Derechos y Obligaciones del Personal Administrativo',
        articles: [
          {
            id: 'admin-derechos-obligaciones',
            articleNumber: 'Derechos y Obligaciones',
            title: 'Lineamientos de Convivencia y Desempeño Laboral',
            content: 'Sujeto a normas MINEDUCYT y contrato CDE.\n' +
              '• Obligaciones: Cumplimiento estricto de horarios, desempeño eficiente, resguardo y reserva de información confidencial, cuidado del patrimonio y recursos del instituto, solicitar oportunamente permisos en caso de ausencia, atención amable y diligente a la comunidad educativa, vestuario adecuado, rechazar tajantemente dádivas, promesas o sobornos, e integrar comisiones de Protección Escolar.\n' +
              '• Derechos: Estabilidad laboral, respeto a la dignidad e integridad, jornada laboral definida, descanso y vacaciones de ley, licencias, ambiente de trabajo seguro, herramientas adecuadas y notificación de evaluaciones de desempeño.',
            keywords: ['personal administrativo', 'ley del servicio civil', 'ley etica gubernamental', 'codigo de trabajo', 'resguardo de informacion', 'cuidado del patrimonio', 'rechazar dadivas soborno', 'vestuario adecuado']
          }
        ]
      }
    ]
  },
  {
    id: 'doc-malla-software-2026',
    code: 'DOC-ACAD-02',
    title: 'Plan de Estudios y Malla Curricular: Técnico en Desarrollo de Software',
    category: 'academico',
    badgeColor: 'blue',
    effectiveDate: 'Ciclo 2025-2026',
    version: 'Edición Vigente 2026.1',
    authority: 'Dirección Académica y Coordinación de Tecnologías de Información (INDEL)',
    description: 'Estructura curricular completa por años y módulos, carga horaria semanal, requisitos de pre-pasantías y competencias del egresado.',
    sections: [
      {
        title: 'Capítulo I: Perfil del Egresado y Competencias Profesionales',
        articles: [
          {
            id: 'malla-art-1',
            articleNumber: 'Art. 1',
            title: 'Perfil Profesional del Egresado',
            content: 'El egresado del Técnico en Desarrollo de Software del INDEL domina el desarrollo full-stack moderno, diseño de arquitecturas cloud, microservicios, seguridad informática (DevSecOps) y la integración de modelos de inteligencia artificial aplicados. Posee rigor ético y capacidad de trabajo bajo metodologías ágiles.',
            keywords: ['perfil', 'egresado', 'full-stack', 'competencias', 'carrera', 'tecnico']
          }
        ]
      },
      {
        title: 'Capítulo II: Malla Curricular de Primer Año',
        articles: [
          {
            id: 'malla-art-2',
            articleNumber: 'Art. 2',
            title: 'Módulos del Primer Año',
            content: 'El primer año comprende 5 módulos formativos con un total de 30 horas semanales:\n' +
              '• Módulo 1.1: Fundamentos de Lógica de Programación y Algoritmos (8 hrs/sem).\n' +
              '• Módulo 1.2: Arquitectura de Computadores y Sistemas Operativos Linux (6 hrs/sem).\n' +
              '• Módulo 1.3: Desarrollo Web Frontend Moderno (8 hrs/sem).\n' +
              '• Módulo 1.4: Matemática Discreta y Lógica Proposicional (4 hrs/sem).\n' +
              '• Módulo 1.5: Inglés Técnico para TI I (4 hrs/sem).',
            keywords: ['primer año', '1 año', 'modulos 1 año', 'algoritmos', 'frontend', 'linux']
          }
        ]
      },
      {
        title: 'Capítulo III: Malla Curricular de Segundo Año y Pre-pasantía',
        articles: [
          {
            id: 'malla-art-3',
            articleNumber: 'Art. 3',
            title: 'Módulos del Segundo Año',
            content: 'El segundo año de Desarrollo de Software consta de 5 módulos de especialización técnica avanzada (32 horas semanales en total):\n' +
              '1. Módulo 2.1: Programación Orientada a Objetos y Patrones de Diseño Avanzados (8 hrs/sem) — principios SOLID, Clean Code, patrones Factory, Singleton, Observer y desarrollo robusto en TypeScript/Java.\n' +
              '2. Módulo 2.2: Bases de Datos Relacionales (PostgreSQL) y NoSQL (MongoDB/Redis) (8 hrs/sem) — modelado entidad-relación, normalización, optimización de queries SQL, índices y almacenamiento de vectores.\n' +
              '3. Módulo 2.3: Desarrollo Backend y APIs RESTful / GraphQL (8 hrs/sem) — arquitecturas de microservicios con Node.js/Express, autenticación JWT, OAuth y contratos GraphQL.\n' +
              '4. Módulo 2.4: Ingeniería de Software y Metodologías Ágiles (4 hrs/sem) — marcos de trabajo Scrum y Kanban, control de versiones Git avanzado, branching strategies y flujos CI/CD.\n' +
              '5. Módulo 2.5: Inglés Técnico para TI II y Presentaciones Profesionales (4 hrs/sem) — preparación para entrevistas técnicas, documentación de APIs y presentaciones en inglés.\n\n' +
              'Art. 4 - Requisito de Pre-pasantía de 2.º Año: 80 horas de pre-pasantía en proyectos internos del INDEL Tech Lab o empresas con convenio.',
            keywords: ['segundo año', '2 año', 'modulos 2 año', 'desarrollo de software', 'backend', 'bases de datos', 'programacion orientada a objetos', 'scrum', 'pre-pasantia 80 horas']
          }
        ]
      }
    ]
  }
];

// Helper to chunk the documents into indexed searchable chunks
export function generateDocumentChunks(docs: OfficialDocument[] = INDEL_DOCUMENTS): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];

  const categoryCoordinates: Record<string, { centerX: number; centerY: number; spread: number }> = {
    reglamento: { centerX: 460, centerY: 150, spread: 55 },
    evaluacion: { centerX: 360, centerY: 390, spread: 45 },
    institucional: { centerX: 220, centerY: 380, spread: 50 },
    academico: { centerX: 210, centerY: 170, spread: 45 },
    admision: { centerX: 470, centerY: 370, spread: 45 },
    seguridad: { centerX: 340, centerY: 230, spread: 40 },
  };

  docs.forEach((doc, docIdx) => {
    const coords = categoryCoordinates[doc.category] || { centerX: 300, centerY: 300, spread: 40 };

    doc.sections.forEach((section, sIdx) => {
      section.articles.forEach((art, aIdx) => {
        const angle = (aIdx + sIdx * 2 + docIdx) * 1.35;
        const radius = 20 + ((aIdx * 17) % coords.spread);
        const x = Math.round(coords.centerX + Math.cos(angle) * radius);
        const y = Math.round(coords.centerY + Math.sin(angle) * radius);

        chunks.push({
          id: `${doc.id}-${art.id}`,
          docId: doc.id,
          docCode: doc.code,
          docTitle: doc.title,
          sectionTitle: section.title,
          articleNumber: art.articleNumber,
          content: `${art.title}: ${art.content}`,
          vectorCoords: { x, y },
          keywords: [...art.keywords, doc.category, doc.title.toLowerCase()]
        });
      });
    });
  });

  return chunks;
}
