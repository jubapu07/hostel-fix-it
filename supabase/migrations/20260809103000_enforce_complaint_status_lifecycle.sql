CREATE OR REPLACE FUNCTION public.enforce_complaint_status_transition()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS NOT DISTINCT FROM NEW.status THEN
    RETURN NEW;
  END IF;

  IF (OLD.status = 'Open' AND NEW.status = 'In Progress')
    OR (OLD.status = 'In Progress' AND NEW.status = 'Resolved') THEN
    RETURN NEW;
  END IF;

  RAISE EXCEPTION 'invalid complaint status transition: % -> %', OLD.status, NEW.status
    USING ERRCODE = 'P0001';
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER complaints_enforce_status_transition
BEFORE UPDATE OF status ON public.complaints
FOR EACH ROW EXECUTE FUNCTION public.enforce_complaint_status_transition();
