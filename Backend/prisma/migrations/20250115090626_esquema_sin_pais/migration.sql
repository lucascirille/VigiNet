-- AlterTable
CREATE SEQUENCE localidad_localidadid_seq;
ALTER TABLE "Localidad" ALTER COLUMN "localidadId" SET DEFAULT nextval('localidad_localidadid_seq');
ALTER SEQUENCE localidad_localidadid_seq OWNED BY "Localidad"."localidadId";
